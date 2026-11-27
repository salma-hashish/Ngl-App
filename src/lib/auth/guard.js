import {AppError} from "../../pkg/error/error.js";
import {env} from "../config/env.js";
import jwt from "jsonwebtoken";

export function authGuard(req, res, next) {
    try {
        console.log(req.cookies);

        const token = req.cookies.access_token;// "{"access_token":"eyladfbjsadbg","refresh_token":"fldnojasfgibdfsihg"}"

        if (!token) throw new AppError('no Token provided', 403);
        req.user = jwt.verify(token, env.jwt.secret);// payload
        next();
    } catch (error) {
        next(error);
    }
}