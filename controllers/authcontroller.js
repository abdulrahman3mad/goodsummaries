const users = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { registerValidation, loginValidation } = require("../validation");

const loginGet = (req, res) => res.render("Auth/login", { errorMakingUser: "" });

const signUpGet = (req, res) => res.render("Auth/signup", { errorMakingUser: "" });

const signUpPost = async (req, res) => {

    //validation
    const { error } = registerValidation(req.body);
    if (error) return res.render("Auth/signup", { errorMakingUser: error.details[0].message })

    console.log("hello")

    //check if exists
    const accountExistByEmail = await users.findOne({ email: req.body.email });
    if (accountExistByEmail) return res.render("Auth/signup", { errorMakingUser: "\"Email\" is already registered" })

    const accounTexistByName = await users.findOne({ name: req.body.name });
    if (accounTexistByName) return res.render("Auth/signup", { errorMakingUser: "\"name\" is already exist" })


    //hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // put user-data
    const user = new users({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
    });

    //save the user
    try {
        const savedUser = await user.save();
        //create the token
        const token = jwt.sign({ _id: user._id }, "this is my great website");
        res.cookie("auth-token", token, { httpOnly: true });
        res.redirect("/");
    } catch {
        res.render("errorPage", { errorMessage: "There is an error, please, reload and try again" });
    }
}

const loginPost = async (req, res) => {

    //validation
    const { error } = loginValidation(req.body);
    if (error) return res.render("Auth/login", { errorMakingUser: error.details[0].message })

    //check if exists
    const user = await users.findOne({ email: req.body.email });
    if (!user) return res.render("Auth/login", { errorMakingUser: "\"Email\" is not found" })


    //check if password right
    const checkedPassword = await bcrypt.compare(req.body.password, user.password);
    if (!checkedPassword) return res.render("Auth/login", { errorMakingUser: "\"password\" is wrong" })

    //create the token
    const token = jwt.sign({ _id: user._id }, "this is my great website");
    res.cookie("auth-token", token, { httpOnly: true });
    res.redirect("/");
}

const logOut = async (req, res) => {
    res.cookie("auth-token", "..", { maxAge: 1, httpOnly: true })
    res.redirect("/login")
}


module.exports = {
    signUpGet,
    signUpPost,
    loginPost,
    loginGet,
    logOut,
}

