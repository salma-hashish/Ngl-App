import { z } from 'zod';

export const sendMessageDto = z.object({
    receiver: z.string().trim().optional(),
    receiverId: z.string().trim().optional(),
    content: z.string().trim().min(1, 'Message cannot be empty').max(200, 'Message cannot exceed 200 characters'),
}).refine(data => data.receiver || data.receiverId, {
    message: 'Receiver ID is required',
    path: ['receiver'],
});

export const respondRequestDto = z.object({
    status: z.enum(['accepted', 'rejected'], {
        errorMap: () => ({ message: "Status must be either 'accepted' or 'rejected'" }),
    }),
});

export const sendConversationMessageDto = z.object({
    content: z.string().trim().min(1, 'Message content cannot be empty').max(1000, 'Message cannot exceed 1000 characters'),
});
