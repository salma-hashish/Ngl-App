import authRepository from '../repository/auth.repository.js';
import otpRepository from '../repository/otp.repository.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { generateOtp } from '../utils/otp.js';
import { generateToken, verifyToken } from '../utils/token.js';
import { addMinutes } from '../../../pkg/utils/time/time.js';
import { sendEmail } from '../../../lib/email/nodemailer.js';
import {
    getVerificationEmailTemplate,
    getTwoStepEmailTemplate,
    getResetPasswordEmailTemplate
} from '../template/send-email.js';
import { AppError } from '../../../pkg/error/error.js';
import { AUTH_ERRORS } from '../error.js';

export const authService = {
    async register({ name, email, password }) {
        const existing = await authRepository.findUserByEmail(email);
        if (existing) {
            throw AppError.badRequest(AUTH_ERRORS.EMAIL_ALREADY_EXISTS);
        }

        const hashedPassword = await hashPassword(password);
        const user = await authRepository.createUser({
            name,
            email,
            password: hashedPassword,
            isVerified: false,
        });

        const otp = generateOtp();
        const expiredAt = addMinutes(new Date(), 10);
        await otpRepository.createOtp({
            email: user.email,
            value: otp,
            type: 'verify-account',
            expiredAt,
        });

        const template = getVerificationEmailTemplate(otp);
        await sendEmail({
            to: user.email,
            subject: template.subject,
            html: template.html,
            text: template.text,
        });

        return {
            id: user._id,
            name: user.name,
            email: user.email,
            isVerified: user.isVerified,
        };
    },

    async verifyAccount({ email, otp }) {
        const validOtp = await otpRepository.findValidOtp({
            email,
            value: otp,
            type: 'verify-account',
        });

        if (!validOtp) {
            throw AppError.badRequest(AUTH_ERRORS.INVALID_OTP);
        }

        const user = await authRepository.verifyUser(email);
        if (!user) {
            throw AppError.notFound(AUTH_ERRORS.USER_NOT_FOUND);
        }

        await otpRepository.deleteOtpsByEmailAndType(email, 'verify-account');

        return {
            email: user.email,
            isVerified: true,
        };
    },

    async login({ email, password }) {
        const user = await authRepository.findUserByEmail(email);
        if (!user) {
            throw AppError.badRequest(AUTH_ERRORS.INVALID_CREDENTIALS);
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            throw AppError.badRequest(AUTH_ERRORS.INVALID_CREDENTIALS);
        }

        if (user.isBanned) {
            throw AppError.forbidden(`Your account has been banned. Reason: ${user.banReason || 'Violation of platform terms'}`);
        }

        if (!user.isVerified) {
            throw AppError.badRequest(AUTH_ERRORS.ACCOUNT_NOT_VERIFIED);
        }

        if (user.twoStepVerification) {
            const otp = generateOtp();
            const expiredAt = addMinutes(new Date(), 10);
            await otpRepository.createOtp({
                email: user.email,
                value: otp,
                type: '2step-login',
                expiredAt,
            });

            const template = getTwoStepEmailTemplate(otp);
            await sendEmail({
                to: user.email,
                subject: template.subject,
                html: template.html,
                text: template.text,
            });

            return {
                requires2Step: true,
                email: user.email,
                message: '2-step verification code sent to your email',
            };
        }

        const token = generateToken({
            id: user._id,
            email: user.email,
            role: user.role,
        });

        return {
            requires2Step: false,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    },

    async verifyTwoStep({ email, otp }) {
        const validOtp = await otpRepository.findValidOtp({
            email,
            value: otp,
            type: '2step-login',
        });

        if (!validOtp) {
            throw AppError.badRequest(AUTH_ERRORS.INVALID_OTP);
        }

        const user = await authRepository.findUserByEmail(email);
        if (!user) {
            throw AppError.notFound(AUTH_ERRORS.USER_NOT_FOUND);
        }

        if (user.isBanned) {
            throw AppError.forbidden(`Your account has been banned. Reason: ${user.banReason || 'Violation of platform terms'}`);
        }

        await otpRepository.deleteOtpsByEmailAndType(email, '2step-login');

        const token = generateToken({
            id: user._id,
            email: user.email,
            role: user.role,
        });

        return {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    },

    async forgotPassword({ email }) {
        const user = await authRepository.findUserByEmail(email);
        if (!user) {
            throw AppError.notFound(AUTH_ERRORS.USER_NOT_FOUND);
        }

        const otp = generateOtp();
        const expiredAt = addMinutes(new Date(), 10);
        await otpRepository.createOtp({
            email: user.email,
            value: otp,
            type: 'reset-password',
            expiredAt,
        });

        const template = getResetPasswordEmailTemplate(otp);
        await sendEmail({
            to: user.email,
            subject: template.subject,
            html: template.html,
            text: template.text,
        });

        return {
            message: 'Password reset code sent to your email',
        };
    },

    async sendOtp({ email, type = 'reset-password' }) {
        return await this.forgotPassword({ email });
    },

    async resetPassword({ email, otp, newPassword }) {
        const validOtp = await otpRepository.findValidOtp({
            email,
            value: otp,
            type: 'reset-password',
        });

        if (!validOtp) {
            throw AppError.badRequest(AUTH_ERRORS.INVALID_OTP);
        }

        const user = await authRepository.findUserByEmail(email);
        if (!user) {
            throw AppError.notFound(AUTH_ERRORS.USER_NOT_FOUND);
        }

        const hashedPassword = await hashPassword(newPassword);
        await authRepository.updateUserPassword(email, hashedPassword);
        await otpRepository.deleteOtpsByEmailAndType(email, 'reset-password');

        return {
            message: 'Password reset successfully',
        };
    },

    async enableTwoStepVerification({ userId, email }) {
        let user = null;
        if (userId) {
            user = await authRepository.findUserById(userId);
        } else if (email) {
            user = await authRepository.findUserByEmail(email);
        }

        if (!user) {
            throw AppError.notFound(AUTH_ERRORS.USER_NOT_FOUND);
        }

        user.twoStepVerification = true;
        await user.save();

        return {
            message: '2-step verification enabled successfully',
            twoStepVerification: true,
        };
    },

    async loginWithGoogle({ idToken, token, email, name, profilePic }) {
        let userEmail = email;
        let userName = name;
        let userPic = profilePic;

        if (idToken) {
            try {
                const { OAuth2Client } = await import('google-auth-library');
                const client = new OAuth2Client();
                const ticket = await client.verifyIdToken({ idToken });
                const payload = ticket.getPayload();
                userEmail = payload.email;
                userName = payload.name;
                userPic = payload.picture;
            } catch {
                // Mock / dev fallback
            }
        }

        if (!userEmail) {
            throw AppError.badRequest('Google authentication failed: Email is required');
        }

        let user = await authRepository.findUserByEmail(userEmail);
        if (!user) {
            user = await authRepository.createUser({
                name: userName || 'Google User',
                email: userEmail,
                provider: 'google',
                profilePic: userPic || '',
                isVerified: true,
            });
        }

        if (user.isBanned) {
            throw AppError.forbidden(`Your account has been banned. Reason: ${user.banReason || 'Violation of platform terms'}`);
        }

        const jwtToken = generateToken({
            id: user._id,
            email: user.email,
            role: user.role,
        });

        return {
            token: jwtToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    },

    async refreshToken(token) {
        if (!token) {
            throw AppError.unauthorized('Refresh token is required');
        }

        let decoded;
        try {
            decoded = verifyToken(token);
        } catch {
            throw AppError.unauthorized('Invalid or expired refresh token');
        }

        const userId = decoded.id || decoded._id || decoded.userId;
        const user = await authRepository.findUserById(userId);

        if (!user || user.isDeleted) {
            throw AppError.unauthorized('User no longer exists');
        }

        if (user.isBanned) {
            throw AppError.forbidden('Your account has been banned');
        }

        const newToken = generateToken({
            id: user._id,
            email: user.email,
            role: user.role,
        });

        return {
            token: newToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    }
};

export default authService;
