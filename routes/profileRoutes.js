
const profileRoute = require("express").Router()
const profileController = require("../controllers/profilepagecontroller")

profileRoute.get("/:name", profileController.getProfilePage)
profileRoute.post("/:name", profileController.changeData);
profileRoute.get("/:name/editProfilePage/", profileController.editProfilePage);
profileRoute.post("/follow/:name/", profileController.followOption);
profileRoute.post("/unfollow/:name/", profileController.unfollowOption);

module.exports = profileRoute