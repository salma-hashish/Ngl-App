import { z } from 'zod';

export const updateProfileDto = z.object({
    name: z.string().trim().min(3, 'Name must be at least 3 characters').max(20, 'Name cannot exceed 20 characters').optional(),
    profilePic: z.string().trim().optional(),
}).refine((data) => data.name !== undefined || data.profilePic !== undefined, {
    message: 'At least one field (name or profilePic) must be provided',
});

export const toggleTwoStepDto = z.object({
    enabled: z.boolean().optional(),
});

export const banUserDto = z.object({
    reason: z.string().trim().min(1).max(300).optional(),
});
