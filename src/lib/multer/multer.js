import multer, { diskStorage } from "multer";
import crypto from "crypto";
import { AppError } from "../../pkg/error/error.js";

export function uploadFile(allowedType = ['image/png', 'image/jpeg', 'image/gif', 'image/jpg']) {
    return multer({
        fileFilter: function (req, file, cb) {
            if (allowedType.includes(file.mimetype)) {
                return cb(null, true);
            }
            cb(new AppError('invalid file format', 400), false);
        },
        storage: diskStorage({
            filename: function (req, file, cb) {
                cb(null, `${crypto.randomInt(99999)}-${file.originalname}`);
            },
            destination: 'uploads',
        }),
    });
}

