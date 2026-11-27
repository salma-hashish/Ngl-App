import userRepository from '../repository/user.repository.js';
import { AppError } from '../../../pkg/error/error.js';
import { USER_ERRORS } from '../error.js';

export const userService = {
    async getProfile(userId) {
        const user = await userRepository.findById(userId);
        if (!user) {
            throw AppError.notFound(USER_ERRORS.USER_NOT_FOUND);
        }
        return user;
    },

    async updateProfile(userId, { name, profilePic }) {
        const updates = {};
        if (name) updates.name = name;
        if (profilePic !== undefined) updates.profilePic = profilePic;

        const updated = await userRepository.updateById(userId, updates);
        if (!updated) {
            throw AppError.notFound(USER_ERRORS.USER_NOT_FOUND);
        }
        return updated;
    },

    async getAllUsers() {
        return await userRepository.findAll();
    },

    async getUserById(userId) {
        const user = await userRepository.findById(userId);
        if (!user) {
            throw AppError.notFound(USER_ERRORS.USER_NOT_FOUND);
        }
        return user;
    },

    async toggleTwoStep(userId, enabled) {
        const user = await userRepository.findById(userId);
        if (!user) {
            throw AppError.notFound(USER_ERRORS.USER_NOT_FOUND);
        }
        const updated = await userRepository.setTwoStep(userId, enabled);
        return {
            twoStepVerification: updated.twoStepVerification,
            message: `2-Step verification has been ${enabled ? 'enabled' : 'disabled'}`,
        };
    },

    async banUser(operatorId, targetUserId, reason = 'Violation of platform policies') {
        if (String(operatorId) === String(targetUserId)) {
            throw AppError.badRequest(USER_ERRORS.CANNOT_BAN_SELF);
        }

        const target = await userRepository.findById(targetUserId);
        if (!target) {
            throw AppError.notFound(USER_ERRORS.USER_NOT_FOUND);
        }

        if (target.isBanned) {
            throw AppError.badRequest(USER_ERRORS.ALREADY_BANNED);
        }

        const updated = await userRepository.banUser(targetUserId, reason);
        return {
            message: 'User banned successfully',
            user: updated,
        };
    },

    async unbanUser(targetUserId) {
        const target = await userRepository.findById(targetUserId);
        if (!target) {
            throw AppError.notFound(USER_ERRORS.USER_NOT_FOUND);
        }

        if (!target.isBanned) {
            throw AppError.badRequest(USER_ERRORS.NOT_BANNED);
        }

        const updated = await userRepository.unbanUser(targetUserId);
        return {
            message: 'User unbanned successfully',
            user: updated,
        };
    }
};

export default userService;
