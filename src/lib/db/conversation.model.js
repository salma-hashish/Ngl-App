import { model, Schema } from 'mongoose';

const conversationMessageSchema = new Schema(
    {
        sender: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
            minlength: 1,
            maxlength: 1000,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const conversationSchema = new Schema(
    {
        originalMessage: {
            type: Schema.Types.ObjectId,
            ref: 'Message',
            required: true,
            unique: true,
        },
        participants: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
        ],
        messages: [conversationMessageSchema],
    },
    { timestamps: true }
);

export const Conversation = model('Conversation', conversationSchema);
export default Conversation;
