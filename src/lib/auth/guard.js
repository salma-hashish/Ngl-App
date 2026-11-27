import jwt from 'jsonwebtoken';
import { AppError } from '../../pkg/error/error.js';
import { env } from '../config/env.js';
import userRepository from '../../app/user/repository/user.repository.js';

function extractToken(req) {
    const authHeader = req.headers?.authorization;
    if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
        return authHeader.slice(7).trim();
    }
    return req.cookies?.token || req.cookies?.access_token || null;
}

export async function authGuard(req, res, next) {
    try {
        const token = extractToken(req);
        if (!token) {
            throw AppError.unauthorized('No authentication token provided');
        }

        const payload = jwt.verify(token, env.jwt.secret);
        const userId = payload.id || payload._id || payload.userId;
        if (!userId) {
            throw AppError.unauthorized('Invalid token payload');
        }

        const user = await userRepository.findById(userId);
        if (!user || user.isDeleted) {
            throw AppError.unauthorized('User no longer exists');
        }

        if (user.isBanned) {
            throw AppError.forbidden(
                `Your account has been banned. Reason: ${user.banReason || 'Violation of platform terms'}`
            );
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
}

export const guard = authGuard;

export function adminGuard(req, res, next) {
    if (!req.user || req.user.role !== 'admin') {
        return next(AppError.forbidden('Admin access required'));
    }
    next();
}

export default authGuard;