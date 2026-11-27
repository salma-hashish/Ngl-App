export function getVerificationEmailTemplate(otp) {
    return {
        subject: 'Verify Your NGL Account',
        text: `Your verification code is: ${otp}. It will expire in 10 minutes.`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2>Welcome to NGL!</h2>
                <p>Please use the following 6-digit code to verify your account:</p>
                <h1 style="color: #4CAF50; letter-spacing: 5px;">${otp}</h1>
                <p>This code will expire in 10 minutes.</p>
                <p>If you did not request this, please ignore this email.</p>
            </div>
        `
    };
}

export function getTwoStepEmailTemplate(otp) {
    return {
        subject: 'Your 2-Step Verification Code',
        text: `Your 2-step verification code is: ${otp}. It will expire in 10 minutes.`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2>2-Step Verification</h2>
                <p>Use the following code to complete your login:</p>
                <h1 style="color: #2196F3; letter-spacing: 5px;">${otp}</h1>
                <p>This code is valid for 10 minutes.</p>
                <p>Do not share this code with anyone.</p>
            </div>
        `
    };
}

export function getResetPasswordEmailTemplate(otp) {
    return {
        subject: 'Reset Your Password - NGL App',
        text: `Your password reset code is: ${otp}. It will expire in 10 minutes.`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2>Password Reset Request</h2>
                <p>You requested to reset your password. Use the code below:</p>
                <h1 style="color: #FF5722; letter-spacing: 5px;">${otp}</h1>
                <p>This code will expire in 10 minutes.</p>
                <p>If you did not request a password reset, you can safely ignore this email.</p>
            </div>
        `
    };
}
