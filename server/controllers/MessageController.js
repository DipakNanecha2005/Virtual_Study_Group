import { MessageModel } from "../models/Message.model.js";
import fs from "fs";

export const getMessages = async (req, res) => {
    try {
        const user1 = req.userId;
        const user2 = req.body.id;
        if (!user1 || !user2) {
            return res.status(400).send("Both user ID's are required");
        }

        const messages = await MessageModel.find({
            $or: [
                { sender: user1, recipient: user2 },
                { sender: user2, recipient: user1 }
            ]
        }).sort({ timestamp: 1 });

        return res.status(200).json({ messages });
    } catch (error) {
        console.log({ error });
        return res.status(500).send("Internal Server error");
    }
}

export const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("File is required");
        }

        const date = Date.now();
        let fileDir = `uploads/files/${date}`;
        let fileName = `${fileDir}/${req.file.originalname}`;
        fs.mkdirSync(fileDir, { recursive: true });
        fs.renameSync(req.file.path, fileName);

        return res.status(200).json({ filePath: fileName });
    } catch (error) {
        console.log({ error });
        return res.status(500).send("Internal Server error");
    }
}