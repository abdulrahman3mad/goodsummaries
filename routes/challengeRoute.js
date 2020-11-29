const route = require("express").Router()
const challengeController = require("../controllers/challenges")

route.get("/challenges", challengeController.getChallenge)
route.post("/challenges", challengeController.addChallenge)
route.delete("/challenges/:id", challengeController.deleteChallenge)
route.post("/challenges/edit/:id", challengeController.editChallenge)

module.exports = route;