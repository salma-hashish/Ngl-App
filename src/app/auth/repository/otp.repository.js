import Otp from '../model/otp.model.js';

export const otpRepository = {
    async createOtp({ email, value, type, expiredAt }) {
        // Remove older OTPs of the same type for this email
        await Otp.deleteMany({ email, type });
        return await Otp.create({ email, value, type, expiredAt });
    },

    async findValidOtp({ email, value, type }) {
        return await Otp.findOne({
            email,
            value,
            type,
            expiredAt: { $gt: new Date() },
        });
    },

    async deleteOtpsByEmailAndType(email, type) {
        return await Otp.deleteMany({ email, type });
    },

    async deleteOtpById(id) {
        return await Otp.findByIdAndDelete(id);
    }
};

export default otpRepository;
