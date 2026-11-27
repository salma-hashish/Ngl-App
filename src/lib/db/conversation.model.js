import { model , Schema} from 'mongoose';

const MessageSchema = new Schema({
    messageId: {
        type: Schema.Types.ObjectId,
        ref: "Message",
        required: true
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });

const conversationSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    messageIds: [ MessageSchema ]
});

export const Conversation = model("Conversation", conversationSchema);
