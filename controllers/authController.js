import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendResetPasswordEmail } from "../config/nodemailer.js";
import dotenv from "dotenv";

dotenv.config();

const generateToken = (id, name, role) => {
  return jwt.sign({ id, name, role }, process.env.JWT_SECRET, {
    expiresIn: "1h", 
  });
};

// Co
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Mot de passe incorrect" });

    const token = generateToken(user.id, user.name, user.role);

    res.json({
      message: "Connexion réussie",
      token,
      user: {
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Inscription 
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Utilisateur déjà existant" });

    const newUser = new User({ name, email, password });
    await newUser.save();

    const token = generateToken(newUser.id, newUser.name, newUser.role);
    res.json({ message: "Utilisateur enregistré", token, role: newUser.role });
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Déco
export const logoutUser = (req, res) => {
  res.json({ message: "Déconnexion réussie" });
};

// Demande de réinitialisation du mdp
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email requis" });

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({
        message: "Si cet email existe, un lien de réinitialisation a été envoyé.",
      });
    }

    
    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; 
    await user.save();

    const emailSent = await sendResetPasswordEmail(user.email, user.name, token);
    if (!emailSent) {
      return res.status(500).json({ message: "Erreur lors de l'envoi de l'email" });
    }

    res.status(200).json({
      message: "Si cet email existe, un lien de réinitialisation a été envoyé.",
    });
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// gestion du reset pass et new token pour new pass

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;

  if (!token || !password) {
    return res.status(400).json({ message: "Token et mot de passe requis" });
  }

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Le mot de passe doit contenir au moins 6 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.",
    });
  }

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Token invalide ou expiré" });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    const newToken = generateToken(user.id, user.name, user.role);

    res.status(200).json({
      message: "Mot de passe réinitialisé avec succès",
      token: newToken,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur, veuillez réessayer plus tard" });
  }
};


