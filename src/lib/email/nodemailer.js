import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", port: 587, secure: false,
    auth: {
        user: env.nodemailer.user, pass: env.nodemailer.password,
    },
});




export async function sendEmail(toOrOptions, subject, html, text) {
    const mailOptions = typeof toOrOptions === 'object' && toOrOptions !== null
        ? {
            from: `"NGL-App" <${env.nodemailer.user}>`,
            to: toOrOptions.to,
            subject: toOrOptions.subject,
            html: toOrOptions.html,
            text: toOrOptions.text,
        }
        : {
            from: `"NGL-App" <${env.nodemailer.user}>`,
            to: toOrOptions,
            subject,
            html,
            text,
        };

    await transporter.sendMail(mailOptions);
}