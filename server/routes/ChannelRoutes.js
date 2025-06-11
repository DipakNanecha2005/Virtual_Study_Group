import express from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { createChannel, getChannelMessages, getUserChannels } from "../controllers/ChannelController.js";

const router = express.Router();

router.post("/create-channel", verifyToken, createChannel);
router.get("/get-user-channels", verifyToken, getUserChannels);
router.get("/get-channel-messages/:channelId", verifyToken, getChannelMessages);

export default router;