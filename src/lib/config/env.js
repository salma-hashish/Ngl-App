import {z} from 'zod';
import {config} from "dotenv";

config();
const schema = z.object({
    PORT: z.string().default('3000'),
    MONGODB_URL: z.string().trim().default('mongodb://127.0.0.1:27017/ngl-app'),

    JWT_SECRET: z.string().trim().default('supersecretjwtkey_ngl_app_2026'),

    SMTP_USER: z.string().trim().toLowerCase().default('test@example.com'),
    SMTP_PASSWORD: z.string().trim().default('password123'),

    REDIS_HOST: z.string().trim().default('127.0.0.1'),
    REDIS_PORT: z.string().trim().default('6379'),
    REDIS_PASSWORD: z.string().trim().default(''),
});

const parsed = schema.parse(process.env);

export const env = {
    port: Number(parsed.PORT),
    redis: {
        host: parsed.REDIS_HOST,
        port: parsed.REDIS_PORT,
        password: parsed.REDIS_PASSWORD,
    },
    db: {
        url: String(parsed.MONGODB_URL),
    },
    jwt: {
        secret: parsed.JWT_SECRET,
    },
    nodemailer: {
        user: parsed.SMTP_USER,
        password: parsed.SMTP_PASSWORD,
    }
};
