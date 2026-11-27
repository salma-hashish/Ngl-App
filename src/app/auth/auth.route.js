import { Router } from 'express';
import * as authController from './controllers/auth.controller.js';
import idempotency from "../../lib/Idempotency/idemotency.js";

const authRouter = Router();

authRouter.post('/register', authController.register);
authRouter.patch('/verify-account', authController.verifyAccount);
authRouter.post('/login', authController.login);
authRouter.post('/send-otp', authController.sendOtp);
authRouter.patch('/reset-password', idempotency({ strict: true }), authController.resetPassword);
authRouter.post('/login-with-google', authController.loginWithGoogle);
authRouter.post('/refresh-token', authController.refreshTokenFn);
authRouter.patch('/enable-2-step-verification', authController.enableTwoStepVerification);
authRouter.post('/verify-to-login', authController.verifyToLogin);

export default authRouter;
