import express from 'express';
import connectDB from './lib/db/mongoose.js';
import cors from 'cors';
import { globalErrorHandler, invalidRoute } from './pkg/error/error.handler.js';
import { router } from './route.js';
import { correlationId } from './lib/correlation/correlationid.js';
import cookieParser from 'cookie-parser';
import { rateLimit, ipKeyGenerator } from 'express-rate-limit';
import { toMs } from './pkg/utils/time/time.js';
import { AppError } from './pkg/error/error.js';
import { env } from './lib/config/env.js';

export function createAuthLimiter({ limit = 3, windowMs = toMs(3, 'minutes') } = {}) {
    return rateLimit({
        windowMs,
        limit,
        handler: function (req, res, next) {
            next(new AppError('Too many requests, please try again later.', 429));
        },
        legacyHeaders: false,
        standardHeaders: 'draft-8',
        keyGenerator: function (req) {
            return `${ipKeyGenerator(req.ip)}:${req.baseUrl}${req.path}`;
        },
    });
}

export function createApp({ connectDatabase = true, enableRateLimit = true } = {}) {
    const app = express();
    app.use(cors({ origin: env.cors.origin, credentials: true }));

    if (connectDatabase) {
        connectDB();
    }

    app.use(express.json());
    app.use(cookieParser());
    app.use(correlationId);

    if (enableRateLimit) {
        app.use('/api/auth', createAuthLimiter());
    }

    app.get('/health', (req, res) => {
        res.json('OK');
    });

    app.use('/api', router);
    app.use(invalidRoute);
    app.use(globalErrorHandler);

    return app;
}

export default createApp;
