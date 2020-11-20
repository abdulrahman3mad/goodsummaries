const { Router } = require("express");
const authcontroller = require("../controllers/authcontroller");
const authroutes = Router();



authroutes.get("/signup", authcontroller.signUpGet);
authroutes.post("/signup", authcontroller.signUpPost);
authroutes.get("/login", authcontroller.loginGet);
authroutes.post("/login", authcontroller.loginPost);
authroutes.get("/logout", authcontroller.logOut)



module.exports = authroutes;