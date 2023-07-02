// Cannot GET /api/v1/films
//додати фільм
//отримати всі фільми
//отримати 1 фільм по айді
//обновити фільм
//видалити фільм по айді
const rolesMiddleware = require('../midlewares/rolesMiddleware');

const filmsRouter = require("express").Router();
const filmsController = require("../controllers/FilmsController");

filmsRouter.post(
    "/films",
    (req, res, next) => {
        console.log("JOI WORKS");
        next();
    },
    filmsController.add
);
filmsRouter.get("/films", rolesMiddleware(["CUSTOMER", "ADMIN", "MODERATOR"]), filmsController.getAll);
filmsRouter.get("/films/:id", filmsController.getById);
filmsRouter.put("/films/:id", filmsController.updateFilm);
filmsRouter.delete("/films/:id", filmsController.deleteById);

module.exports = filmsRouter;
// "ADMIN"
// "CUSTOMER"
// "MODERATOR"
// "USER"
// ["CUSTOMER", "ADMIN", "MODERATOR"]