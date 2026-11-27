import { model, Schema } from 'mongoose';

const requestSchema = new Schema(
    {
        message: {
            type: Schema.Types.ObjectId,
            ref: 'Message',
            required: true,
        },
        sender: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        receiver: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending',
        },
        conversation: {
            type: Schema.Types.ObjectId,
            ref: 'Conversation',
            default: null,
        },
    },
    { timestamps: true }
);

export const RequestModel = model('Request', requestSchema);
export default RequestModel;
