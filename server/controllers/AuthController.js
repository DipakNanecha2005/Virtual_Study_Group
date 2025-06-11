import bcrypt from "bcryptjs";
import { UserModel } from "../models/User.model.js";
import jwt from "jsonwebtoken";
import fs from "fs";

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (email, userId) => {
    return jwt.sign({ email, userId }, process.env.JWT_KEY, { expiresIn: maxAge });
};

export const signup = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send("Email and Password is required");
        }

        const userExists = await UserModel.findOne({ email });
        if (userExists) {
            return res.status(400).send(`${email} already exists`);
        }

        const user = await UserModel.create({ email, password });
        res.cookie("jwt", createToken(email, user._id), {
            maxAge,
            secure: true,
            sameSite: "None"
        });
        return res.status(201).json({
            user: {
                id: user._id,
                email: user.email,
                profileSetup: user.profileSetup
            }
        });
    } catch (error) {
        console.log({ error });
        return res.status(500).send("Internal Server error");
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send("Email and Password is required");
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).send("User with given email not found");
        }

        const auth = await bcrypt.compare(password, user.password);
        if (!auth) {
            return res.status(400).send("Password is incorrect");
        }

        res.cookie("jwt", createToken(email, user._id), {
            maxAge,
            secure: true,
            sameSite: "None"
        });
        return res.status(200).json({
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                profileSetup: user.profileSetup
            }
        });
    } catch (error) {
        console.log({ error });
        return res.status(500).send("Internal Server error");
    }
}

export const getUserInfo = async (req, res) => {
    try {
        const userData = await UserModel.findById(req.userId);
        if (!userData) {
            return res.status(404).send("User with the given id not found");
        }

        return res.status(200).json({
            id: userData._id,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            image: userData.image,
            profileSetup: userData.profileSetup
        });
    } catch (error) {
        console.log({ error });
        return res.status(500).send("Internal Server error");
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { firstName, lastName } = req.body;
        if (!firstName || !lastName) {
            return res.status(400).send("Firstname and lastname is required");
        }

        const userData = await UserModel.findByIdAndUpdate(req.userId, {
            firstName, lastName, profileSetup: true
        }, { new: true, runValidators: true });
        return res.status(200).json({
            id: userData._id,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            image: userData.image,
            profileSetup: userData.profileSetup
        });
    } catch (error) {
        console.log({ error });
        return res.status(500).send("Internal Server error");
    }
}

export const addProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.staus(400).send("File is required");
        }

        const date = Date.now();
        const fileName = "uploads/profiles/" + date + req.file.originalname;
        fs.renameSync(req.file.path, fileName);

        const updatedUser = await UserModel.findByIdAndUpdate(req.userId, { image: fileName }, { new: true, runValidators: true });
        console.log({ image: updatedUser.image });

        return res.status(200).json({
            // id: userData._id,
            // email: userData.email,
            // firstName: userData.firstName,
            // lastName: userData.lastName,
            image: updatedUser.image,
            // profileSetup: userData.profileSetup
        });
    } catch (error) {
        console.log({ error });
        return res.status(500).send("Internal Server error");
    }
}

export const removeProfileImage = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);
        if (!user) {
            return res.status(404).send("User not found");
        }

        if (user.image) {
            fs.unlinkSync(user.image);
        }
        user.image = null;
        await user.save();

        return res.status(200).send("Profile image removed successfully");
    } catch (error) {
        console.log({ error });
        return res.status(500).send("Internal Server error");
    }
}

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { 
            maxAge: 0, 
            secure: true, 
            sameSite: "None" 
        });
        return res.status(200).send("Logout successfully");
    } catch (error) {
        console.log({ error });
        return res.status(500).send("Internal Server error");
    }
}