import User from '../model/user.model.js';

export const userRepository = {
    async findById(id) {
        return await User.findOne({ _id: id, isDeleted: false });
    },

    async findByEmail(email) {
        return await User.findOne({ email, isDeleted: false });
    },

    async findAll(filter = {}) {
        return await User.find({ ...filter, isDeleted: false }).select('-password');
    },

    async updateById(id, updateData) {
        return await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
    },

    async banUser(id, reason = 'Violation of terms') {
        return await User.findByIdAndUpdate(
            id,
            { isBanned: true, banReason: reason },
            { new: true }
        ).select('-password');
    },

    async unbanUser(id) {
        return await User.findByIdAndUpdate(
            id,
            { isBanned: false, banReason: '' },
            { new: true }
        ).select('-password');
    },

    async setTwoStep(id, enabled) {
        return await User.findByIdAndUpdate(
            id,
            { twoStepVerification: enabled },
            { new: true }
        ).select('-password');
    }
};

export default userRepository;
