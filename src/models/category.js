import mongoose from "../config/db.js";

const { Schema, model } = mongoose;

const CategorySchema = new Schema({
  name: { type: String, required: true },
});

export const CategoryModel = model("User", CategorySchema);
