const express = require("express");
const router = express.Router();
const {getAllUsers, createUser, getSingleUser, updateUser, deleteUser, updateMe} = require("./../controllers/UserController");
const authenticationController = require('./../controllers/authenticationController');

router.post("/signup", authenticationController.signup);
router.post("/login", authenticationController.login);

router.post("/forgotPassword", authenticationController.forgotPassword);
router.patch("/resetPassword/:token", authenticationController.resetPassword);

router.patch("/updateMyPassword", authenticationController.protect, authenticationController.updatePassword);
router.patch("/updateMe", authenticationController.protect, updateMe);

router.get("/", getAllUsers);
router.post("/", createUser);
router.get("/:id", getSingleUser);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;