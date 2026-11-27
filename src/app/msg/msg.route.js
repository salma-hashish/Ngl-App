import { Router } from 'express';
import msgController from './controllers/msg.controller.js';
import { guard } from '../../lib/auth/guard.js';
import { validate } from '../../lib/validation/validation.js';
import {
    sendMessageDto,
    respondRequestDto,
    sendConversationMessageDto
} from './dto/msg.dto.js';

const router = Router();

router.use(guard);

// 1) Send Anonymous Message & Get Incoming
router.post('/send', validate(sendMessageDto), msgController.sendMessage);
router.post('/', validate(sendMessageDto), msgController.sendMessage);

router.get('/incoming', msgController.getIncomingMessages);
router.get('/', msgController.getIncomingMessages);

// 2) Request Sender Identity
router.post('/request-identity', msgController.requestIdentity);
router.post('/:id/request-identity', msgController.requestIdentity);

// 3) Get Requests
router.get('/requests', msgController.getRequests);
router.get('/requests/received', msgController.getRequests);
router.get('/requests/sent', msgController.getSentRequests);

// 4) Accept or Reject Request
router.patch('/request/:id/accept', msgController.acceptRequest);
router.patch('/requests/:id/accept', msgController.acceptRequest);

router.patch('/request/:id/reject', msgController.rejectRequest);
router.patch('/requests/:id/reject', msgController.rejectRequest);

router.patch('/request/:id/status', validate(respondRequestDto), msgController.respondToRequest);
router.patch('/requests/:id', validate(respondRequestDto), msgController.respondToRequest);

// 5) Conversations & Conversation Messages
router.get('/conversations', msgController.getUserConversations);

router.post('/conversation/:id/messages', validate(sendConversationMessageDto), msgController.sendConversationMessage);
router.post('/conversation/:id/message', validate(sendConversationMessageDto), msgController.sendConversationMessage);

router.get('/conversation/:id/messages', msgController.getConversation);
router.get('/conversation/:id', msgController.getConversation);

// Single message details
router.get('/:id', msgController.getMessageById);

export default router;
