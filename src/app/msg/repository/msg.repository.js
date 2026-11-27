import Message from '../model/msg.model.js';
import Request from '../../../lib/db/request.model.js';
import Conversation from '../../../lib/db/conversation.model.js';

export const msgRepository = {
    // Message operations
    async createMessage({ sender, receiver, content, isAnonymous = true }) {
        return await Message.create({
            sender,
            receiver,
            content,
            isAnonymous,
            isIdentityRevealed: false,
        });
    },

    async findMessageById(id) {
        return await Message.findOne({ _id: id, isDeleted: false });
    },

    async findIncomingMessages(receiverId) {
        return await Message.find({ receiver: receiverId, isDeleted: false })
            .sort({ createdAt: -1 });
    },

    async findOutgoingMessages(senderId) {
        return await Message.find({ sender: senderId, isDeleted: false })
            .populate('receiver', 'name email profilePic')
            .sort({ createdAt: -1 });
    },

    async updateMessage(id, updateData) {
        return await Message.findByIdAndUpdate(id, updateData, { new: true });
    },

    async softDeleteMessage(id) {
        return await Message.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    },

    // Request operations
    async createRequest({ message, sender, receiver }) {
        return await Request.create({
            message,
            sender,
            receiver,
            status: 'pending',
        });
    },

    async findRequestById(id) {
        return await Request.findById(id)
            .populate('message', 'content isAnonymous isIdentityRevealed createdAt')
            .populate('receiver', 'name email profilePic')
            .populate('sender', 'name email profilePic');
    },

    async findRequestByMessageId(messageId) {
        return await Request.findOne({ message: messageId });
    },

    async findRequestsReceivedBySender(senderId) {
        return await Request.find({ sender: senderId })
            .populate('message', 'content isAnonymous isIdentityRevealed createdAt')
            .populate('receiver', 'name email profilePic')
            .sort({ createdAt: -1 });
    },

    async findRequestsSentByReceiver(receiverId) {
        return await Request.find({ receiver: receiverId })
            .populate('message', 'content isAnonymous isIdentityRevealed createdAt')
            .populate('sender', 'name email profilePic')
            .sort({ createdAt: -1 });
    },

    async updateRequest(id, updateData) {
        return await Request.findByIdAndUpdate(id, updateData, { new: true });
    },

    // Conversation operations
    async createConversation({ originalMessage, participants }) {
        return await Conversation.create({
            originalMessage,
            participants,
            messages: [],
        });
    },

    async findConversationById(id) {
        return await Conversation.findById(id)
            .populate('participants', 'name email profilePic')
            .populate('originalMessage', 'content createdAt')
            .populate('messages.sender', 'name email profilePic');
    },

    async findConversationByOriginalMessage(messageId) {
        return await Conversation.findOne({ originalMessage: messageId })
            .populate('participants', 'name email profilePic')
            .populate('messages.sender', 'name email profilePic');
    },

    async findConversationsForUser(userId) {
        return await Conversation.find({ participants: userId })
            .populate('participants', 'name email profilePic')
            .populate('originalMessage', 'content createdAt')
            .sort({ updatedAt: -1 });
    },

    async addMessageToConversation(conversationId, { sender, content }) {
        return await Conversation.findByIdAndUpdate(
            conversationId,
            {
                $push: {
                    messages: {
                        sender,
                        content,
                        createdAt: new Date(),
                    }
                }
            },
            { new: true }
        )
            .populate('participants', 'name email profilePic')
            .populate('messages.sender', 'name email profilePic');
    }
};

export default msgRepository;
