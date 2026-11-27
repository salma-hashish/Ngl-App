import { AppError } from '../../pkg/error/error.js';

export function validateBody(dto, body) {
    const result = dto.safeParse(body ?? {});
    if (!result.success) {
        const errMessages = result.error.issues.map((issue) => {
            const path = issue.path.length ? `${issue.path.join('.')}: ` : '';
            return `${path}${issue.message}`;
        });
        throw new AppError(errMessages.join(', '), 400);
    }

    return result.data;
}

export function validate(dto, source = 'body') {
    return (req, res, next) => {
        try {
            req[source] = validateBody(dto, req[source]);
            next();
        } catch (error) {
            next(error);
        }
    };
}

export default validate;