
const profileRoute = require("express").Router()
const profileController = require("../controllers/profilepagecontroller")

profileRoute.get("/:name", profileController.getProfilePage)
profileRoute.post("/:name", profileController.changeData);
profileRoute.get("/:name/editProfilePage/", profileController.editProfilePage);


module.exports = profileRoute