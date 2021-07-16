const router = require("express").Router()
const homeController = require("../controllers/homeController")

router.get("/", homeController.getMainPage);
router.get("/search", homeController.getMainPage);
module.exports = router;