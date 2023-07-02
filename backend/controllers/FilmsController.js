const FilmsModel = require("../models/filmsModel");
const asyncHandler = require("express-async-handler");
const { isValidObjectId } = require("mongoose");

class FilmsController {
    // add = async (req, res) => {
    //     await FilmsModel.create({ ...req.body });
    // };

    add = asyncHandler(async (req, res) => {
        const { title } = req.body;
        if (!title) {
            res.status(400);
            throw new Error("Provide all required fields");
        }

        const film = await FilmsModel.create({ ...req.body });

        res.status(201);
        res.json({ code: 201, data: film });
    });

    getAll = asyncHandler(async (req, res) => {
        const films = await FilmsModel.find({});
        res.status(200);
        res.json({ code: 200, data: films, qty: films.length });
    });

    getById = asyncHandler(async (req, res) => {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            res.status(400);
            throw new Error("Invalid ID");
        }

        const film = await FilmsModel.findById(id);

        res.status(200);
        res.json({ code: 200, data: film });
    });

    updateFilm = asyncHandler(async (req, res) => {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            res.status(400);
            throw new Error("Invalid ID");
        }

        const film = await FilmsModel.findByIdAndUpdate(
            id,
            { ...req.body },
            { new: true }
        );

        res.status(200);
        res.json({ code: 200, data: film });
    });

    deleteById = asyncHandler(async (req, res) => {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            res.status(400);
            throw new Error("Invalid ID");
        }

        const film = await FilmsModel.findByIdAndRemove(id);

        res.status(200);
        res.json({ code: 200, data: film });
    });
}

module.exports = new FilmsController();
