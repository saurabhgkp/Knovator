var express = require("express");
var router = express.Router();
var userController = require("../controllers/users");
const isAuth = require('../middleware/isAuth')

router.get("/", function (req, res) {
  res.send("this is User Route");
});

router.post("/register", userController.register);
router.post("/login", userController.login);


router.post("/postCreate", isAuth, userController.addressCreate);
router.post("/editPost", isAuth, userController.editPost);
router.post("/removePost", isAuth, userController.removeItem);
router.get("/getPost", isAuth, userController.getItem);
router.get("/getGeoLocation", isAuth, userController.getGeoLocation);
router.get("/getCount", isAuth, userController.getCount);
module.exports = router;
