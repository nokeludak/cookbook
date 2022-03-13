const mongoose = require("mongoose");

const ReciepeSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: "Dish name is required!",
  },
  description: {
    type: String,
    trim: true,
    required: "Dish description is required!",
  },
  author: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: "User is required!",
  },
  ingredients: {
    type: String,
    trim: true,
    required: "Dish ingredient list is required!",
  },
  category: {
    type: String,
    trim: true,
    required: "Dish category is required",
  },
  instructions: {
    type: String,
    trim: true,
    required: "Instructions for making dish is required",
  },
  rating: {
    type: Array,
  },
  picture: {
    type: String,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Reciepe", ReciepeSchema);
