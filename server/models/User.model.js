import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required."],
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, "password is required."],
        trim: true
    },
    firstName: {
        type: String,
        required: false
    },
    lastName: {
        type: String,
        required: false
    },
    // gender: {
    //     type: String,
    //     enum: ["male", "female"],
    //     default: "male "
    // },
    image: {
        type: String,
        required: false
    },
    profileSetup: {
        type: Boolean,
        default: false
    },
    // bio: {
    //     type: String
    // },
    // refreshToken: String
}, { timestamps: true });

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

export const UserModel = mongoose.model("User", UserSchema);