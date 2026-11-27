import {fileTypeFromBuffer} from "file-type";
import fs from 'fs';
import {AppError} from "../../pkg/error/error.js";

export const fileValidation = (allowedTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/jpg'])=>{
    return async (req, res, next) => {
        try {
            console.log(req.file);
            const filePath = req.file.path;
            const buffer = fs.readFileSync(filePath);
            console.log(buffer);
            const type = await fileTypeFromBuffer(buffer);

            if (!type || !allowedTypes.includes(type.mime)) {
                fs.unlinkSync(req.file.path);
                return next(new AppError("Invalid file type"
                    , 400
                ));
            }

            return next();
        } catch (error) {
            return next(new Error("Internal server error"));
        }
    };
}
