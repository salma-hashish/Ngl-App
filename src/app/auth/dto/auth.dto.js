import { z } from 'zod';

export const registerDto = z.object({
    name: z.string().trim().min(3, 'Name must be at least 3 characters').max(20, 'Name cannot exceed 20 characters'),
    email: z.string().trim().email('Invalid email address').toLowerCase(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const verifyOtpDto = z.object({
    email: z.string().trim().email('Invalid email address').toLowerCase(),
    otp: z.string().trim().length(6, 'OTP must be 6 digits'),
});

export const loginDto = z.object({
    email: z.string().trim().email('Invalid email address').toLowerCase(),
    password: z.string().min(1, 'Password is required'),
});

export const twoStepVerifyDto = z.object({
    email: z.string().trim().email('Invalid email address').toLowerCase(),
    otp: z.string().trim().length(6, 'OTP must be 6 digits'),
});

export const forgotPasswordDto = z.object({
    email: z.string().trim().email('Invalid email address').toLowerCase(),
});

export const sendOtpDto = z.object({
    email: z.string().trim().email('Invalid email address').toLowerCase(),
    type: z.enum(['verify-account', 'reset-password', '2step-login']).default('reset-password'),
});

export const loginWithGoogleDto = z.object({
    idToken: z.string().trim().min(1).optional(),
    token: z.string().trim().min(1).optional(),
    email: z.string().trim().email('Invalid email address').toLowerCase().optional(),
    name: z.string().trim().optional(),
    profilePic: z.string().trim().optional(),
}).refine((data) => data.idToken || data.email, {
    message: 'Google idToken or email is required',
    path: ['email'],
});

export const refreshTokenDto = z.object({
    token: z.string().trim().optional(),
    refreshToken: z.string().trim().optional(),
});

export const resetPasswordDto = z.object({
    email: z.string().trim().email('Invalid email address').toLowerCase(),
    otp: z.string().trim().length(6, 'OTP must be 6 digits'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters').optional(),
    password: z.string().min(6, 'Password must be at least 6 characters').optional(),
}).refine((data) => data.newPassword || data.password, {
    message: 'New password is required',
    path: ['newPassword'],
});
