import { Router } from 'express';
import msgController from './controllers/msg.controller.js';
import { authGuard } from '../../lib/auth/guard.js';
import { validate } from '../../lib/validation/validation.js';
import {
    sendMessageDto,
    sendConversationMessageDto,
} from './dto/msg.dto.js';

const router = Router();

router.use(authGuard);

// 1) Send Anonymous Message & Get Incoming
router.post('/send', validate(sendMessageDto), msgController.sendMessage);
router.get('/incoming', msgController.getIncomingMessages);

// 2) Request Sender Identity
router.post('/:id/request-identity', msgController.requestIdentity);

// 3) Get Requests
router.get('/requests', msgController.getRequests);
router.get('/requests/sent', msgController.getSentRequests);

// 4) Accept or Reject Request
router.patch('/request/:id/accept', msgController.acceptRequest);
router.patch('/request/:id/reject', msgController.rejectRequest);

// 5) Conversations & Conversation Messages
router.get('/conversations', msgController.getUserConversations);
router.post('/conversation/:id/messages', validate(sendConversationMessageDto), msgController.sendConversationMessage);
router.get('/conversation/:id', msgController.getConversation);

// Single message details (must stay after static routes)
router.get('/:id', msgController.getMessageById);

export default router;
