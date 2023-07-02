const jwt = require("jsonwebtoken");
const { Error } = require("mongoose");

module.exports = (req, res, next) => {
    // отримуємо токен
    // розшифровуємо токен
    // передаємо id (з токена) далі
    // 
    try {
        const [tokenType, token] = req.headers.authorization.split(" ");

        if (tokenType !== "Bearer") {
            res.status(401);
            throw new Error("Not a Bearer token");
        };

        if (token) {
            const decoded = jwt.verify(token, "pizza");

            req.user = decoded.id;
            next();
        }
    } catch (error) {
        res.status(401).json({
            code: 401,
            error: error.message
        })
    }

    


};