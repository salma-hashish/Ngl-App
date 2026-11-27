import User from '../../user/model/user.model.js';

export const authRepository = {
    async findUserByEmail(email) {
        return await User.findOne({ email, isDeleted: false });
    },

    async findUserById(id) {
        return await User.findOne({ _id: id, isDeleted: false });
    },

    async createUser(userData) {
        return await User.create(userData);
    },

    async updateUser(id, updateData) {
        return await User.findByIdAndUpdate(id, updateData, { new: true });
    },

    async updateUserPassword(email, hashedPassword) {
        return await User.findOneAndUpdate(
            { email, isDeleted: false },
            { password: hashedPassword },
            { new: true }
        );
    },

    async verifyUser(email) {
        return await User.findOneAndUpdate(
            { email, isDeleted: false },
            { isVerified: true },
            { new: true }
        );
    }
};

export default authRepository;
