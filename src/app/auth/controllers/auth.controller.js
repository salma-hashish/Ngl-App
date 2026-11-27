import authService from '../service/auth.service.js';

export async function register(req, res, next) {
    try {
        const data = await authService.register(req.body);
        res.status(201).json({
            success: true,
            message: 'User registered successfully. Verification code sent to email.',
            data,
        });
    } catch (error) {
        next(error);
    }
}

export async function verifyAccount(req, res, next) {
    try {
        const data = await authService.verifyAccount(req.body);
        res.status(200).json({
            success: true,
            message: 'Account verified successfully',
            data,
        });
    } catch (error) {
        next(error);
    }
}

export const verify = verifyAccount;

export async function login(req, res, next) {
    try {
        const result = await authService.login(req.body);

        if (result.token) {
            res.cookie('token', result.token, {
                httpOnly: true,
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
        }

        res.status(200).json({
            success: true,
            message: result.message || 'Logged in successfully',
            data: result,
        });
    } catch (error) {
        next(error);
    }
}

export async function sendOtp(req, res, next) {
    try {
        const result = await authService.sendOtp(req.body);
        res.status(200).json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        next(error);
    }
}

export const forgotPassword = sendOtp;

export async function resetPassword(req, res, next) {
    try {
        const { email, otp, newPassword, password } = req.body;
        const result = await authService.resetPassword({
            email,
            otp,
            newPassword: newPassword || password,
        });
        res.status(200).json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        next(error);
    }
}

export async function loginWithGoogle(req, res, next) {
    try {
        const result = await authService.loginWithGoogle(req.body);

        if (result.token) {
            res.cookie('token', result.token, {
                httpOnly: true,
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
        }

        res.status(200).json({
            success: true,
            message: 'Google login successful',
            data: result,
        });
    } catch (error) {
        next(error);
    }
}

export async function refreshTokenFn(req, res, next) {
    try {
        const token = req.body.token || req.body.refreshToken || req.cookies?.token;
        const result = await authService.refreshToken(token);

        if (result.token) {
            res.cookie('token', result.token, {
                httpOnly: true,
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
        }

        res.status(200).json({
            success: true,
            message: 'Token refreshed successfully',
            data: result,
        });
    } catch (error) {
        next(error);
    }
}

export const refreshToken = refreshTokenFn;

export async function enableTwoStepVerification(req, res, next) {
    try {
        const userId = req.user?._id || req.body.userId;
        const email = req.user?.email || req.body.email;
        const result = await authService.enableTwoStepVerification({ userId, email });

        res.status(200).json({
            success: true,
            message: result.message,
            data: result,
        });
    } catch (error) {
        next(error);
    }
}

export async function verifyToLogin(req, res, next) {
    try {
        const result = await authService.verifyTwoStep(req.body);

        res.cookie('token', result.token, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            success: true,
            message: '2-step verification successful',
            data: result,
        });
    } catch (error) {
        next(error);
    }
}

export const verifyTwoStep = verifyToLogin;

export default {
    register,
    verifyAccount,
    verify,
    login,
    sendOtp,
    forgotPassword,
    resetPassword,
    loginWithGoogle,
    refreshTokenFn,
    refreshToken,
    enableTwoStepVerification,
    verifyToLogin,
    verifyTwoStep,
};
