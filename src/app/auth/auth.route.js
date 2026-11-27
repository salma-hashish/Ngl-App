import { Router } from 'express';
import * as authController from './controllers/auth.controller.js';
import idempotency from '../../lib/Idempotency/idemotency.js';
import { authGuard } from '../../lib/auth/guard.js';
import { validate } from '../../lib/validation/validation.js';
import {
    registerDto,
    verifyOtpDto,
    loginDto,
    twoStepVerifyDto,
    forgotPasswordDto,
    sendOtpDto,
    resetPasswordDto,
    loginWithGoogleDto,
    refreshTokenDto,
} from './dto/auth.dto.js';

const authRouter = Router();

authRouter.post('/register', validate(registerDto), authController.register);
authRouter.patch('/verify-account', validate(verifyOtpDto), authController.verifyAccount);
authRouter.post('/login', validate(loginDto), authController.login);
authRouter.post('/send-otp', validate(sendOtpDto), authController.sendOtp);
authRouter.post('/forgot-password', validate(forgotPasswordDto), authController.forgotPassword);
authRouter.patch('/reset-password', validate(resetPasswordDto), idempotency({ strict: true }), authController.resetPassword);
authRouter.post('/login-with-google', validate(loginWithGoogleDto), authController.loginWithGoogle);
authRouter.post('/refresh-token', validate(refreshTokenDto), authController.refreshTokenFn);
authRouter.patch('/enable-2-step-verification', authGuard, authController.enableTwoStepVerification);
authRouter.post('/verify-to-login', validate(twoStepVerifyDto), authController.verifyToLogin);

export default authRouter;
