const express = require("express");
const router = express.Router();
const {getAllUsers, createUser, getSingleUser, updateUser, deleteUser} = require("./../controllers/UserController");

router.get("/", getAllUsers);
router.post("/", createUser);
router.get("/:id", getSingleUser);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;