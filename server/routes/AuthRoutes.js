import express from "express";
import { addProfileImage, getUserInfo, login, logout, removeProfileImage, signup, updateProfile } from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import multer from "multer";


const router = express.Router();
const upload = multer({ dest: "uploads/profiles/"});

router.post("/signup", signup);
router.post("/login", login);
// router.use(verifyToken); // below this no need of adding 'verityToken' middleware
router.get("/user-info", verifyToken, getUserInfo);
router.post("/update-profile", verifyToken, updateProfile);
router.post("/add-profile-image", verifyToken, upload.single("profile-image"), addProfileImage);
router.delete("/remove-profile-image", verifyToken, removeProfileImage);
router.post("/logout", verifyToken, logout);

export default router;