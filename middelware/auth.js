
const jwt = require("jsonwebtoken");
const users = require("../models/users");

module.exports = async function (req, res, next) {

    const token = req.cookies["auth-token"];

    if (!token) {
        res.locals.user = req.user = null;
        next();
    }
    else {
        try {
            const verifiedtoken = jwt.verify(token, "this is my great website")
            let user = await users.findById(verifiedtoken._id);
            res.locals.user = req.user = user;
            next();

        } catch {
            res.locals.user = req.user = null;
            next();
        }
    }

}

