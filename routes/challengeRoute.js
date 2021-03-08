const route = require("express").Router()
const challengeController = require("../controllers/challengescontroller")

route.get("/:name", challengeController.getChallenge)
route.post("/", challengeController.addChallenge)
route.delete("/delete/:id", challengeController.deleteChallenge)
route.post("/edit/:id", challengeController.editChallenge)

module.exports = route;