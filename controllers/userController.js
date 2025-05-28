import User from "../models/User.js";

// Info user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé" });

    res.json({ user });
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// All users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    if (users.length === 0) {
      return res.status(404).json({ message: "Aucun utilisateur trouvé" });
    }

    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// deleteUser
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.status(200).json({
      message: "Utilisateur supprimé avec succès",
      user: deletedUser,
    });
  } catch {
    res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur" });
  }
};

// update user by id
export const updateUserById = async (req, res) => {
  const { name, email, role } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé" });

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;

    await user.save();
    res.json({ updatedUser: user });
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
};