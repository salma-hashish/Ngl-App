import { z } from 'zod';
import { config } from 'dotenv';

config();

const DEV_JWT_FALLBACK = 'dev_only_jwt_secret_change_in_production';

const schema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.string().default('3000'),
    MONGODB_URL: z.string().trim().default('mongodb://127.0.0.1:27017/ngl-app'),

    JWT_SECRET: z.string().trim().optional(),
    CORS_ORIGIN: z.string().trim().default('http://localhost:3000'),

    SMTP_USER: z.string().trim().toLowerCase().default('test@example.com'),
    SMTP_PASSWORD: z.string().trim().default('password123'),

    REDIS_HOST: z.string().trim().default('127.0.0.1'),
    REDIS_PORT: z.string().trim().default('6379'),
    REDIS_PASSWORD: z.string().trim().default(''),
});

export function parseEnv(rawEnv = process.env) {
    const parsed = schema.parse(rawEnv);

    if (parsed.NODE_ENV === 'production' && !parsed.JWT_SECRET) {
        throw new Error('JWT_SECRET environment variable is required in production');
    }

    const corsOrigin = parsed.CORS_ORIGIN.includes(',')
        ? parsed.CORS_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean)
        : parsed.CORS_ORIGIN;

    return {
        nodeEnv: parsed.NODE_ENV,
        port: Number(parsed.PORT),
        cors: {
            origin: corsOrigin,
        },
        redis: {
            host: parsed.REDIS_HOST,
            port: parsed.REDIS_PORT,
            password: parsed.REDIS_PASSWORD,
        },
        db: {
            url: String(parsed.MONGODB_URL),
        },
        jwt: {
            secret: parsed.JWT_SECRET || DEV_JWT_FALLBACK,
        },
        nodemailer: {
            user: parsed.SMTP_USER,
            password: parsed.SMTP_PASSWORD,
        },
    };
}

export const env = parseEnv(process.env);
