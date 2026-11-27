import { AppError } from "../../pkg/error/error.js";

export const userNotFound = new AppError('User Not Found', 404);
export const userAlreadyExists = new AppError('User Already Exists', 409);

export const USER_ERRORS = {
    USER_NOT_FOUND: 'User Not Found',
    CANNOT_BAN_SELF: 'You cannot ban your own account',
    ALREADY_BANNED: 'User is already banned',
    NOT_BANNED: 'User is not banned',
    UNAUTHORIZED_ACTION: 'You are not authorized to perform this action',
    RECEIVER_NOT_FOUND: 'Receiver not found or deactivated',
    MESSAGE_NOT_FOUND: 'Message not found',
    REQUEST_NOT_FOUND: 'Identity request not found',
    CONVERSATION_NOT_FOUND: 'Conversation not found',
};

export default {
    userNotFound,
    userAlreadyExists,
    USER_ERRORS,
};
