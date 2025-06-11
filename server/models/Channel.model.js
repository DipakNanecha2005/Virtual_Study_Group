import mongoose from "mongoose";

const ChannelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    ],
    admin: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    ],
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
            required: false
        }
    ],
    // createdAt: {
    //     type: Date,
    //     default: Date.now,
    //     immutable: true
    // },
}, { timestamps: true });

export const ChannelModel = mongoose.model("Channel", ChannelSchema);