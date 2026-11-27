import mongoose from 'mongoose';

const msgSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'Message content is required'],
        minlength: [1, 'Message cannot be empty'],
        maxlength: [200, 'Message cannot exceed 200 characters'],
        trim: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Receiver is required'],
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Sender is required'],
    },
    isAnonymous: {
        type: Boolean,
        default: true,
    },
    isIdentityRevealed: {
        type: Boolean,
        default: false,
    },
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        default: null,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

export const Message = mongoose.model('Message', msgSchema);
export default Message;
