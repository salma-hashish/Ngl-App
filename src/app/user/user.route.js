import { Router } from 'express';
import userController from './controllers/user.controller.js';
import { authGuard, adminGuard } from '../../lib/auth/guard.js';
import { validate } from '../../lib/validation/validation.js';
import { updateProfileDto, toggleTwoStepDto, banUserDto } from './dto/user.dto.js';
import { uploadFile } from '../../lib/multer/multer.js';
import { fileValidation } from '../../lib/multer/file.validation.js';

const userRouter = Router();

userRouter.use(authGuard);

userRouter.get('/profile', userController.getProfile);
userRouter.patch('/profile', validate(updateProfileDto), userController.updateProfile);

userRouter.patch('/2step/enable', userController.enableTwoStep);
userRouter.patch('/2step/disable', userController.disableTwoStep);
userRouter.patch('/2step', validate(toggleTwoStepDto), userController.toggleTwoStep);

userRouter.patch('/ban/:id', adminGuard, validate(banUserDto), userController.banUser);
userRouter.patch('/unban/:id', adminGuard, userController.unbanUser);

userRouter.patch('/upload-profile-pic', uploadFile().single('pp'), (req, res) => {
    res.json({ success: true, message: 'ok' });
});

userRouter.patch(
    '/upload-cv',
    uploadFile(['application/pdf', 'application/msword']).single('cv'),
    fileValidation(['application/pdf', 'application/msword']),
    (req, res) => {
        res.json({ success: true, message: 'ok' });
    }
);

userRouter.get('/', userController.getAllUsers);
userRouter.get('/:id', userController.getUserById);

export default userRouter;