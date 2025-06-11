import { Server } from "socket.io"
import { MessageModel } from "./models/Message.model.js";
import { ChannelModel } from "./models/Channel.model.js";

export const setupSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: [process.env.ORIGINS],
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
            credentials: true
        }
    });

    const userSocketMap = new Map();

    const disconnect = (socket) => {
        console.log(`Client disconnected: ${socket.id}`);
        for (const [userId, socketId] of userSocketMap.entries()) {
            if (socketId == socket.id) {
                userSocketMap.delete(userId);
                break;
            }
        }
    }

    const sendMessage = async (message) => {
        const senderSocketId = userSocketMap.get(message.sender);
        const recipientSocketId = userSocketMap.get(message.recipient);

        const createdMessage = await MessageModel.create(message);
        const messageData = await MessageModel.findById(createdMessage._id)
            .populate("sender", "id email firstName lastName image")
            .populate("recipient", "id email firstName lastName image");

        if (recipientSocketId) {
            io.to(recipientSocketId).emit("receieveMessage", messageData)
        }
        if (senderSocketId) {
            io.to(senderSocketId).emit("receieveMessage", messageData)
        }
    }

    const sendChannelMessage = async (message) => {
        const { channelId, sender, content, messageType, fileUrl } = message;
        // console.log({ message }); // tesing
        const createMessage = await MessageModel.create({
            sender,
            recipient: null,
            content,
            messageType,
            fileUrl
        });

        const messageData = await MessageModel.findById(createMessage._id)
            .populate("sender", "id email firstName lastName image")
            .exec();
        await ChannelModel.findByIdAndUpdate(channelId, {
            $push: { messages: createMessage._id }
        });

        const channel = await ChannelModel.findById(channelId).populate("members");
        const finalData = { ...messageData._doc, channelId: channelId };

        if (channel && channel.members) {
            channel.members.forEach((member) => {
                const memberSocketId = userSocketMap.get(member._id.toString());
                if (memberSocketId) { // if user is online than true
                    io.to(memberSocketId).emit("receive-channel-message", finalData);
                }
            });
            // console.log({ channel }); // testing

            const adminSocketId = userSocketMap.get(channel.admin[0]._id.toString());
            if (adminSocketId) {
                io.to(adminSocketId).emit("receive-channel-message", finalData);
            }
        }
    }

    // startS from here
    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;
        if (userId) {
            userSocketMap.set(userId, socket.id);
            console.log(`User connected: ${userId} with socket ID: ${socket.id}`);
        } else {
            console.log("User ID not provided during connection");
        }

        socket.on("sendMessage", sendMessage);
        socket.on("send-channel-message", sendChannelMessage);
        socket.on("disconnect", () => disconnect(socket));
    });
}