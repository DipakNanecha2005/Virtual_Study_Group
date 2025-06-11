import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    messageType: {
        type: String,
        enum: ["text", "file"],
        required: true
    },
    content: {
        type: String,
        required: function () {
            return this.messageType === "text";
        }
    },
    fileUrl: {
        type: String,
        required: function () {
            return this.messageType === "file";
        }
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export const MessageModel = mongoose.model("Message", MessageSchema);