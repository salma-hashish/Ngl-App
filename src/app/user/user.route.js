import {Router} from 'express';
import {uploadFile} from "../../lib/multer/multer.js";
import {fileValidation} from "../../lib/multer/file.validation.js";


const userRouter = Router();

userRouter.patch('/upload-profile-pic', uploadFile().single('pp'), (req, res, next) => {
    res.json('ok');
})

userRouter.patch('/upload-cv',
    uploadFile(['application/pdf', 'application/msword'])
        .single('cv'),
    fileValidation(),
    (req, res, next) => {
        res.json('ok');
    }
)

export default userRouter;