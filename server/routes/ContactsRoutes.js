import express from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { getAllContacts, getContactsForDMList, searchContacts } from "../controllers/ContactsController.js";

const router = express.Router();

router.post("/search", verifyToken, searchContacts);
router.get("/get-contacts-for-dm", verifyToken, getContactsForDMList);
router.get("/get-all-contacts", verifyToken, getAllContacts);

export default router;