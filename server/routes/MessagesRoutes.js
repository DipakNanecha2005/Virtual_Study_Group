import express from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { getMessages, uploadFile } from "../controllers/MessageController.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/files" })

router.post("/get-messages", verifyToken, getMessages)
router.post("/upload-file", verifyToken, upload.single("file"), uploadFile);

export default router;