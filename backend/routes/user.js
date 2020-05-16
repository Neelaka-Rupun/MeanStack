const express = require("express");
const userController = require("../controllers/user");
const router = express.Router();

//Create a user in backend
router.post("/signup", userController.createUser);
router.post("/login", userController.userLogin);

module.exports = router;
