// import "dotenv/config";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { setupSocket } from "./socket.js";
// import path from "path";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const databaseURL = process.env.ATLAS_URL || process.env.MONGODB_URL;

// pre-definded middlewares
app.use(cors({
    origin: [process.env.ORIGINS],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
}));
// const allowedOrigins = process.env.ORIGINS?.split(',') || [];
// app.use(cors({
//     origin: (origin, next) => {
//         if (allowedOrigins.includes(origin) || !origin) {
//             next(null, true);
//         } else {
//             next(new Error('Not allowed by CORS'));
//         }
//     },
//     // methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
//     credentials: true
// }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));
// const __dirname = path.dirname(new URL(import.meta.url).pathname);
// app.use("/uploads/profiles", express.static(path.join(__dirname, "uploads", "profiles")));

// route import
import authRoute from "./routes/AuthRoutes.js";
import contactsRoute from "./routes/ContactsRoutes.js";
import messagesRoute from "./routes/MessagesRoutes.js";
import channelRoute from "./routes/ChannelRoutes.js";

// route middleware
app.use("/api/auth", authRoute);
app.use("/api/contacts", contactsRoute);
app.use("/api/messages", messagesRoute);
app.use("/api/channel", channelRoute);








const server = app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});    

mongoose.connect(databaseURL)
.then(conn => console.log("Database connected", conn.connection.host))
.catch(error => {
    console.warn("Error connecting database:", error.message);
    process.exit(1);
});        

setupSocket(server);

app.get("/", (req, res) => {
    res.status(200).send("Home");
});

// error middleware
app.use((err, req, res, next) => {
    console.log("error middleware:", err);
    return res.status(err.status || 500).json({ error: err.message, status: err.status || 500, success: false });
});