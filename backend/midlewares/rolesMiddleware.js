const jwt = require("jsonwebtoken");

module.exports = (rolesArr) => {
    return (req, res, next) => {
        try {
            const [tokenType, token] = req.headers.authorization.split(" ");

            if (tokenType !== "Bearer") {
                res.status(401);
                throw new Error("Not a Bearer token");
            };

            if (token) {
                const decoded = jwt.verify(token, "pizza");

                const roles = decoded.roles;

                let hasRole = false;

                roles.forEach(role => {
                    if (rolesArr.includes(role)) {
                        hasRole = true;
                    }
                });

                if (!hasRole) {
                    res.status(403);
                    throw new Error("Forbidden")
                }

                next();
            }
        } catch (error) {
            res.status(403).json({
                code: 403,
                error: error.message
            })
        }
        
    }
}