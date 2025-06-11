import mongoose from "mongoose";
import { ChannelModel } from "../models/Channel.model.js";
import { UserModel } from "../models/User.model.js";

export const createChannel = async (req, res) => {
    try {
        const { name, members } = req.body;
        const { userId } = req;

        const admin = await UserModel.findById(userId);
        if (!admin) {
            return res.status(404).send("Admin user not found");
        }
        
        const validMembers = await UserModel.find({ _id: { $in: members } });
        if (validMembers.length !== members.length) {
            return res.status(400).send("Some members are not valid users");
        }

        const newChannel = await ChannelModel.create({
            name,
            members,
            admin: userId
        });

        return res.status(201).json({ channel: newChannel });
    } catch (error) {
        console.log({ error });
        return res.status(500).send("Internal Server error");
    }
}

export const getUserChannels = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.userId);

        const channels = await ChannelModel.find({
            $or: [{ admin: userId }, { members: userId }]
        }).sort({ updatedAt: -1 });
        
        return res.status(201).json({ channels });
    } catch (error) {
        console.log({ error });
        return res.status(500).send("Internal Server error");
    }
}

export const getChannelMessages = async (req, res) => {
    try {
        const { channelId } = req.params;
        const channel = await ChannelModel.findById(channelId)
            .populate({
                path: "messages",
                populate: {
                    path: "sender",
                    select: "_id firstName lastName email image"
                }
            });
        if (!channel) {   
            return res.status(404).send("Channel not found");
        }
        // const messages = channel.messages;
        return res.status(200).json({ messages: channel.messages });
    } catch (error) {
        console.log({ error });
        return res.status(500).send("Internal Server error");
    }
}