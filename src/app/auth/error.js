import {AppError} from "../../pkg/error/error.js";

export const AccountAlreadyVerified = new AppError('account already verified', 400);
export const expiredOtp = new AppError('Expired OTP', 400)
export const invalidOtp = new AppError('invalid OTP code', 400);
export const notVerifiedAccount = new AppError('plz verify your account first', 400);
export const invalidPassword = new AppError('invalid password', 400);