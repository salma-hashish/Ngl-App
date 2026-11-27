import {z} from 'zod'
import {AppError} from "../../pkg/error/error.js";

export function validateBody(dto, body) {
    const result = z.safeParse(dto, body);
    if (result.success === false) {
        console.log(result.error.issues);
        const errMessages = result.error.issues.map(issus =>
            `${issus.path[0]}: ${issus.message}`
        );
        throw new AppError(errMessages.join(', '), 400);
    }

    return result.data;
}