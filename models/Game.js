import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  name: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  steamLink: { type: String, required: true },
  minPlayers: { type: Number, required: true },
  image: { type: String, required: true },
  platforms: [{ type: String, required: true }],
  averageRating: { type: Number, required: true },
  genre: { type: String, required: true },
});

const Game = mongoose.model("Game", gameSchema);

export default Game;
