import { model } from 'mongoose';

const Schema = new Schema(
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
},
    { timestamps: true,}
);

export const RequestModel = model('Request', Schema);
export default RequestModel;
