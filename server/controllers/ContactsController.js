import mongoose from "mongoose";
import { UserModel } from "../models/User.model.js";
import { MessageModel } from "../models/Message.model.js";

export const searchContacts = async (req, res) => {
    try {
        const { searchTerm } = req.body;
        if (searchTerm === undefined || searchTerm === null) {
            return res.status(400).send("searchTerm is required");
        }

        const regex = new RegExp(searchTerm, "i");

        const contacts = await UserModel.find({
            $and: [
                { _id: { $ne: req.userId } },
                { $or: [{ firstname: regex }, { lastName: regex }, { email: regex }] }
            ]
        });

        return res.status(200).json({ contacts });
    } catch (error) {
        console.log({ error });
        return res.status(500).send("Internal Server error");
    }
}

export const getContactsForDMList = async (req, res) => {
    try {
        let { userId } = req;
        userId = new mongoose.Types.ObjectId(userId);
        const userCollectionName = UserModel.collection.name;
        const contacts = await MessageModel.aggregate([
            {
                $match: {
                    $or: [{ sender: userId }, { recipient: userId }]
                }
            },
            {
                $sort: { timestamp: -1 }
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ["$sender", userId] },
                            then: "$recipient",
                            else: "$sender"
                        }
                    },
                    lastMessageTime: { $first: "$timestamp" }
                }
            },
            {
                $lookup: {
                    // from: "users",
                    from: userCollectionName,
                    localField: "_id",
                    foreignField: "_id",
                    as: "contactInfo"
                }
            },
            {
                $unwind: "$contactInfo"
            },
            {
                $project: {
                    _id: 1,
                    lastMessageTime: 1,
                    email: "$contactInfo.email",
                    firstName: "$contactInfo.firstName",
                    lastName: "$contactInfo.lastName",
                    image: "$contactInfo.image"
                }
            },
            {
                $sort: { lastMessageTime: -1 }
            }
        ]);

        return res.status(200).json({ contacts });
    } catch (error) {
        console.log({ error });
        return res.status(500).send("Internal Server error");
    }
}

export const getAllContacts = async (req, res) => {
    try {
        const users = await UserModel.find(
            { _id: { $ne: req.userId } },
            "firstName lastNamme _id email"
        );

        const contacts = users.map((user) => ({
            label: (user.firstName && user.lastName) ? `${user.firstName} ${user.lastName}` : user.email,
            value: user._id
        }));

        return res.status(200).json({ contacts });
    } catch (error) {
        console.log({ error });
        return res.status(500).send("Internal Server error");
    }
}