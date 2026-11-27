import { AppError } from "../../pkg/error/error.js";

export const AccountAlreadyVerified = new AppError('account already verified', 400);
export const expiredOtp = new AppError('Expired OTP', 400);
export const invalidOtp = new AppError('invalid OTP code', 400);
export const notVerifiedAccount = new AppError('plz verify your account first', 400);
export const invalidPassword = new AppError('invalid password', 400);

export const AUTH_ERRORS = {
    EMAIL_ALREADY_EXISTS: 'Email already exists',
    INVALID_OTP: 'Invalid or expired OTP code',
    USER_NOT_FOUND: 'User not found',
    INVALID_CREDENTIALS: 'Invalid email or password',
    ACCOUNT_NOT_VERIFIED: 'Please verify your account first',
    ACCOUNT_ALREADY_VERIFIED: 'Account is already verified',
};

export default {
    AccountAlreadyVerified,
    expiredOtp,
    invalidOtp,
    notVerifiedAccount,
    invalidPassword,
    AUTH_ERRORS,
};