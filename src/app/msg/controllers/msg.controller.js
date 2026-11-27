import msgService from '../service/msg.service.js';

export const msgController = {
    // 1) Send Anonymous Message
    async sendMessage(req, res, next) {
        try {
            const data = await msgService.sendAnonymousMessage(req.user._id, req.body);
            res.status(201).json({
                success: true,
                message: 'Anonymous message sent successfully',
                data,
            });
        } catch (error) {
            next(error);
        }
    },

    // Get incoming messages for the receiver
    async getIncomingMessages(req, res, next) {
        try {
            const messages = await msgService.getIncomingMessages(req.user._id);
            res.status(200).json({
                success: true,
                data: messages,
            });
        } catch (error) {
            next(error);
        }
    },

    // Get single message
    async getMessageById(req, res, next) {
        try {
            const message = await msgService.getMessageById(req.user._id, req.params.id);
            res.status(200).json({
                success: true,
                data: message,
            });
        } catch (error) {
            next(error);
        }
    },

    // 2) Request Sender Identity
    async requestIdentity(req, res, next) {
        try {
            const messageId = req.params.id || req.body.messageId;
            const request = await msgService.requestSenderIdentity(req.user._id, messageId);
            res.status(201).json({
                success: true,
                message: 'Sender identity request submitted successfully',
                data: request,
            });
        } catch (error) {
            next(error);
        }
    },

    // 3) Get Requests (view requests received by sender)
    async getRequests(req, res, next) {
        try {
            const requests = await msgService.getReceivedRequests(req.user._id);
            res.status(200).json({
                success: true,
                data: requests,
            });
        } catch (error) {
            next(error);
        }
    },

    // Get requests sent by receiver
    async getSentRequests(req, res, next) {
        try {
            const requests = await msgService.getSentRequests(req.user._id);
            res.status(200).json({
                success: true,
                data: requests,
            });
        } catch (error) {
            next(error);
        }
    },

    // 4) Accept or Reject Request
    async respondToRequest(req, res, next) {
        try {
            const { status } = req.body;
            const result = await msgService.respondToRequest(req.user._id, req.params.id, status);
            res.status(200).json({
                success: true,
                message: result.message,
                data: {
                    request: result.request,
                    conversation: result.conversation,
                },
            });
        } catch (error) {
            next(error);
        }
    },

    async acceptRequest(req, res, next) {
        try {
            const result = await msgService.respondToRequest(req.user._id, req.params.id, 'accepted');
            res.status(200).json({
                success: true,
                message: result.message,
                data: {
                    request: result.request,
                    conversation: result.conversation,
                },
            });
        } catch (error) {
            next(error);
        }
    },

    async rejectRequest(req, res, next) {
        try {
            const result = await msgService.respondToRequest(req.user._id, req.params.id, 'rejected');
            res.status(200).json({
                success: true,
                message: result.message,
                data: {
                    request: result.request,
                },
            });
        } catch (error) {
            next(error);
        }
    },

    // 4) Send Messages inside Conversation
    async sendConversationMessage(req, res, next) {
        try {
            const result = await msgService.sendMessageInConversation(
                req.user._id,
                req.params.id,
                req.body.content
            );
            res.status(201).json({
                success: true,
                message: result.message,
                data: result.newMessage,
                conversation: result.conversation,
            });
        } catch (error) {
            next(error);
        }
    },

    // 5) Get Conversation Messages
    async getConversation(req, res, next) {
        try {
            const { page, limit } = req.query || {};
            const conversation = await msgService.getConversation(req.user._id, req.params.id, { page, limit });
            res.status(200).json({
                success: true,
                data: conversation,
            });
        } catch (error) {
            next(error);
        }
    },

    // Get all conversations for logged in user
    async getUserConversations(req, res, next) {
        try {
            const conversations = await msgService.getUserConversations(req.user._id);
            res.status(200).json({
                success: true,
                data: conversations,
            });
        } catch (error) {
            next(error);
        }
    }
};

export default msgController;
