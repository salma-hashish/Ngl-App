import mongoose from 'mongoose';
import msgRepository from '../repository/msg.repository.js';
import userRepository from '../../user/repository/user.repository.js';
import { AppError } from '../../../pkg/error/error.js';
import { USER_ERRORS } from '../../user/error.js';

export const msgService = {
    // 1) Send Anonymous Message
    async sendAnonymousMessage(senderId, { receiver, receiverId, content }) {
        const targetReceiverId = receiver || receiverId;

        let receiverUser = null;
        if (mongoose.Types.ObjectId.isValid(targetReceiverId)) {
            receiverUser = await userRepository.findById(targetReceiverId);
        } else {
            receiverUser = await userRepository.findByEmail(targetReceiverId);
        }

        if (!receiverUser) {
            throw AppError.notFound(USER_ERRORS.RECEIVER_NOT_FOUND);
        }

        if (receiverUser._id.toString() === senderId.toString()) {
            throw AppError.badRequest('You cannot send an anonymous message to yourself');
        }

        const message = await msgRepository.createMessage({
            sender: senderId,
            receiver: receiverUser._id,
            content,
            isAnonymous: true,
        });

        // The receiver cannot know the sender's identity
        return {
            id: message._id,
            receiver: message.receiver,
            content: message.content,
            createdAt: message.createdAt,
            isAnonymous: true,
        };
    },

    // Get incoming messages for the logged-in receiver
    async getIncomingMessages(receiverId) {
        const messages = await msgRepository.findIncomingMessages(receiverId);

        // Populate sender only if identity is revealed
        const populatedMessages = await Promise.all(
            messages.map(async (msg) => {
                const msgObj = msg.toObject();
                if (msg.isIdentityRevealed) {
                    const sender = await userRepository.findById(msg.sender);
                    msgObj.sender = sender
                        ? { _id: sender._id, name: sender.name, email: sender.email, profilePic: sender.profilePic }
                        : null;
                } else {
                    // Receiver cannot know sender's identity
                    msgObj.sender = null;
                }
                return msgObj;
            })
        );

        return populatedMessages;
    },

    // Get single message by ID
    async getMessageById(userId, messageId) {
        const message = await msgRepository.findMessageById(messageId);
        if (!message) {
            throw AppError.notFound(USER_ERRORS.MESSAGE_NOT_FOUND);
        }

        const isReceiver = message.receiver.toString() === userId.toString();
        const isSender = message.sender.toString() === userId.toString();

        if (!isReceiver && !isSender) {
            throw AppError.forbidden('You are not authorized to view this message');
        }

        const msgObj = message.toObject();
        if (isReceiver && !message.isIdentityRevealed) {
            msgObj.sender = null;
        } else {
            const sender = await userRepository.findById(message.sender);
            msgObj.sender = sender
                ? { _id: sender._id, name: sender.name, email: sender.email, profilePic: sender.profilePic }
                : null;
        }

        return msgObj;
    },

    // 2) Request Sender Identity
    async requestSenderIdentity(receiverId, messageId) {
        const message = await msgRepository.findMessageById(messageId);
        if (!message) {
            throw AppError.notFound(USER_ERRORS.MESSAGE_NOT_FOUND);
        }

        if (message.receiver.toString() !== receiverId.toString()) {
            throw AppError.forbidden('Only the receiver of this message can request the sender identity');
        }

        if (message.isIdentityRevealed) {
            throw AppError.badRequest('Sender identity has already been revealed for this message');
        }

        const existingRequest = await msgRepository.findRequestByMessageId(messageId);
        if (existingRequest) {
            if (existingRequest.status === 'pending') {
                throw AppError.badRequest('An identity request is already pending for this message');
            }
            if (existingRequest.status === 'accepted') {
                throw AppError.badRequest('This identity request has already been accepted');
            }
            if (existingRequest.status === 'rejected') {
                throw AppError.badRequest('Identity request for this message was previously rejected');
            }
        }

        const request = await msgRepository.createRequest({
            message: message._id,
            sender: message.sender,
            receiver: receiverId,
        });

        return request;
    },

    // 3) Get Requests (view requests received by sender)
    async getReceivedRequests(senderId) {
        return await msgRepository.findRequestsReceivedBySender(senderId);
    },

    // Get requests sent by receiver
    async getSentRequests(receiverId) {
        const requests = await msgRepository.findRequestsSentByReceiver(receiverId);

        // Hide sender details unless accepted
        return requests.map((req) => {
            const reqObj = req.toObject();
            if (req.status !== 'accepted') {
                reqObj.sender = null;
            }
            return reqObj;
        });
    },

    // 4) Accept or Reject Request & 5) Create Conversation
    async respondToRequest(senderId, requestId, status) {
        const request = await msgRepository.findRequestById(requestId);
        if (!request) {
            throw AppError.notFound(USER_ERRORS.REQUEST_NOT_FOUND);
        }

        const reqSenderId = request.sender?._id || request.sender;
        if (reqSenderId.toString() !== senderId.toString()) {
            throw AppError.forbidden('Only the sender who received this request can accept or reject it');
        }

        if (request.status !== 'pending') {
            throw AppError.badRequest(`This request has already been ${request.status}`);
        }

        if (status === 'rejected') {
            request.status = 'rejected';
            await request.save();
            return {
                message: 'Identity request rejected. Your identity remains hidden.',
                request,
                conversation: null,
            };
        }

        // If accepted:
        request.status = 'accepted';

        // Reveal sender identity on original message
        const message = await msgRepository.findMessageById(request.message?._id || request.message);
        if (message) {
            message.isIdentityRevealed = true;
        }

        // 5) Create Conversation between sender and receiver, linked to original message
        const reqReceiverId = request.receiver?._id || request.receiver;
        let conversation = await msgRepository.findConversationByOriginalMessage(message?._id || request.message);

        if (!conversation) {
            conversation = await msgRepository.createConversation({
                originalMessage: message?._id || request.message,
                participants: [reqSenderId, reqReceiverId],
            });
        }

        if (message) {
            message.conversation = conversation._id;
            await message.save();
        }

        request.conversation = conversation._id;
        await request.save();

        return {
            message: 'Identity request accepted. Sender identity is now revealed and conversation created.',
            request,
            conversation,
        };
    },

    // 4) Send Messages inside Conversation
    async sendMessageInConversation(userId, conversationId, content) {
        const conversation = await msgRepository.findConversationById(conversationId);
        if (!conversation) {
            throw AppError.notFound(USER_ERRORS.CONVERSATION_NOT_FOUND);
        }

        const isParticipant = conversation.participants.some(
            (p) => (p._id || p).toString() === userId.toString()
        );

        if (!isParticipant) {
            throw AppError.forbidden('Authorization failed: Only the two users involved can send messages in this conversation');
        }

        const updatedConversation = await msgRepository.addMessageToConversation(conversationId, {
            sender: userId,
            content,
        });

        const latestMessage = updatedConversation.messages[updatedConversation.messages.length - 1];

        return {
            message: 'Message sent successfully',
            conversationId: updatedConversation._id,
            newMessage: latestMessage,
            conversation: updatedConversation,
        };
    },

    // 5) Get Conversation Messages
    async getConversation(userId, conversationId) {
        const conversation = await msgRepository.findConversationById(conversationId);
        if (!conversation) {
            throw AppError.notFound(USER_ERRORS.CONVERSATION_NOT_FOUND);
        }

        const isParticipant = conversation.participants.some(
            (p) => (p._id || p).toString() === userId.toString()
        );

        if (!isParticipant) {
            throw AppError.forbidden('Authorization failed: Only the two users involved can access this conversation');
        }

        return conversation;
    },

    // Get all conversations for logged in user
    async getUserConversations(userId) {
        return await msgRepository.findConversationsForUser(userId);
    }
};

export default msgService;
