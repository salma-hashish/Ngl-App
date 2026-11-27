import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
    value: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    type: {
        type: String,
        enum: ['verify-account', 'reset-password', '2step-login'],
        default: 'verify-account',
    },
    expiredAt: {
        type: Date,
        required: true,
        index: { expires: 0 },
    },
}, {
    timestamps: true,
});

export const Otp = mongoose.model('Otp', otpSchema);
export default Otp;
