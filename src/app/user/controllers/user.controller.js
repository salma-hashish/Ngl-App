import userService from '../services/user.service.js';

export const userController = {
    async getProfile(req, res, next) {
        try {
            const user = await userService.getProfile(req.user._id);
            res.status(200).json({
                success: true,
                data: user,
            });
        } catch (error) {
            next(error);
        }
    },

    async updateProfile(req, res, next) {
        try {
            const updated = await userService.updateProfile(req.user._id, req.body);
            res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                data: updated,
            });
        } catch (error) {
            next(error);
        }
    },

    async getAllUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers();
            res.status(200).json({
                success: true,
                data: users,
            });
        } catch (error) {
            next(error);
        }
    },

    async getUserById(req, res, next) {
        try {
            const user = await userService.getUserById(req.params.id);
            res.status(200).json({
                success: true,
                data: user,
            });
        } catch (error) {
            next(error);
        }
    },

    async enableTwoStep(req, res, next) {
        try {
            const result = await userService.toggleTwoStep(req.user._id, true);
            res.status(200).json({
                success: true,
                message: result.message,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },

    async disableTwoStep(req, res, next) {
        try {
            const result = await userService.toggleTwoStep(req.user._id, false);
            res.status(200).json({
                success: true,
                message: result.message,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },

    async toggleTwoStep(req, res, next) {
        try {
            const body = req.body || {};
            const enabled = body.enabled !== undefined ? Boolean(body.enabled) : true;
            const result = await userService.toggleTwoStep(req.user._id, enabled);
            res.status(200).json({
                success: true,
                message: result.message,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },

    async banUser(req, res, next) {
        try {
            const body = req.body || {};
            const targetId = req.params.id || body.userId;
            const { reason } = body;
            const result = await userService.banUser(req.user._id, targetId, reason);
            res.status(200).json({
                success: true,
                message: result.message,
                data: result.user,
            });
        } catch (error) {
            next(error);
        }
    },

    async unbanUser(req, res, next) {
        try {
            const body = req.body || {};
            const targetId = req.params.id || body.userId;
            const result = await userService.unbanUser(targetId);
            res.status(200).json({
                success: true,
                message: result.message,
                data: result.user,
            });
        } catch (error) {
            next(error);
        }
    }
};

export default userController;
