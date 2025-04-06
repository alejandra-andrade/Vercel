import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: "El usuario ya existe" });
        }

        const user = await User.create({
            name,
            email,
            password, 
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error("Error al registrar usuario:", error.message);
        res.status(500).json({ message: "Error al registrar usuario" });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            res.status(200).json({
                token: generateToken(user._id),
                userId: user._id, 
            });
        } else {
            res.status(401).json({ message: "Credenciales incorrectas" });
        }
    } catch (error) {
        console.error("Error al iniciar sesión:", error.message);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password"); 
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
