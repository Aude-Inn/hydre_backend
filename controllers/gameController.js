import Game from "../models/Game.js";
import Notification from "../models/Notification.js";

// Create a game
export const createGame = async (req, res) => {
  const {
    name,
    releaseDate,
    steamLink,
    minPlayers,
    image,
    platforms,
    averageRating,
    genre,
  } = req.body;

  try {
    const newGame = new Game({
      name,
      releaseDate,
      steamLink,
      minPlayers,
      image,
      platforms,
      averageRating,
      genre,
    });

    const savedGame = await newGame.save();

    const newNotification = new Notification({
      name,
      addedAt: new Date(),
    });

    await newNotification.save();

    const io = req.app.get("io");
    if (io) {
      io.emit("game_notification", {
        name,
        addedAt: new Date().toISOString(),
      });
    }

    return res.status(201).json({
      message: "Jeu créé avec succès",
      game: savedGame,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Validation error", errors: error.errors });
    }

    return res.status(500).json({ message: "Erreur lors de la création du jeu" });
  }
};

// Get a game by ID
export const getGame = async (req, res) => {
  const { id } = req.params;

  try {
    const game = await Game.findById(id);

    if (!game) {
      return res.status(404).json({ message: "Jeu non trouvé" });
    }

    res.status(200).json(game);
  } catch {
    return res.status(500).json({ message: "Erreur lors de la récupération du jeu" });
  }
};

// en travaux___________________________________________________________________________________________________________________
export const getAllGames = async (req, res) => {
  console.log("req.query =", req.query); 

  const search = req.query.search?.trim();
  console.log("Recherche côté serveur :", search);

  try {
    let games;
    if (!search) {
      games = [];
    } else {
      games = await Game.find({
        name: { $regex: search, $options: "i" },
      });
    }
    res.status(200).json(games);
  } catch (error) {
    console.error("Erreur lors de la récupération des jeux :", error);
    res.status(500).json({ message: "Erreur lors de la récupération des jeux" });
  }
};

// _______________________________________________________________________________________________________________

// Update a game
export const updateGame = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedGame = await Game.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedGame) {
      return res.status(404).json({ message: "Jeu non trouvé" });
    }

    res.status(200).json({
      message: "Jeu mis à jour avec succès",
      game: updatedGame,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Validation error", errors: error.errors });
    }

    return res.status(500).json({ message: "Erreur lors de la mise à jour du jeu" });
  }
};

// Delete a game
export const deleteGame = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedGame = await Game.findByIdAndDelete(id);

    if (!deletedGame) {
      return res.status(404).json({ message: "Jeu non trouvé" });
    }

    res.status(200).json({
      message: "Jeu supprimé avec succès",
      game: deletedGame,
    });
  } catch {
    return res.status(500).json({ message: "Erreur lors de la suppression du jeu" });
  }
};

