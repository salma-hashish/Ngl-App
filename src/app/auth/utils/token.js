import jwt from 'jsonwebtoken';
import { env } from '../../../lib/config/env.js';

export function generateAccessToken(payload, expiresIn = '7d') {
    return jwt.sign(payload, env.jwt.secret, { expiresIn });
}

export function generateToken(payload, expiresIn = '7d') {
    return generateAccessToken(payload, expiresIn);
}

export function verifyToken(token) {
    return jwt.verify(token, env.jwt.secret);
}

export function generateRefreshToken(payload) {
    return jwt.sign(payload, env.jwt.secret, { expiresIn: '7d' });
}

export function verifyRefreshToken(token) {
    return jwt.verify(token, env.jwt.secret);
}
