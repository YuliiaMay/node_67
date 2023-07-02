const { Schema, model } = require("mongoose");

const filmsSchema = new Schema({
    title: { type: String, required: true },
    ganre: { type: String, default: "Tragedy" },
    year: { type: Number, default: 1990 },
    cast: { type: String, default: "Sandra Bullok" },
});

module.exports = model("films", filmsSchema);
