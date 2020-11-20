const joi = require("@hapi/joi");

const registerValidation = (userData) => {
    const Schema = joi.object({
        name: joi.string().required().min(6),
        email: joi.string().required().email(),
        password: joi.string().required().min(6),
    })

    return Schema.validate(userData);
}

const loginValidation = (userData) => {
    const Schema = joi.object({
        email: joi.string().required().email(),
        password: joi.string().required().min(6),
    })

    return Schema.validate(userData);
}
const changeDataValidation = (userData) => {
    const Schema = joi.object({
        name: joi.string().min(6),
    })

    return Schema.validate(userData);
}
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.changeDataValidation = changeDataValidation;