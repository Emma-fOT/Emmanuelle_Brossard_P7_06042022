const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user");
const auth = require("../middleware/auth");

router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);
router.delete("/:id", auth, userCtrl.deleteUser);
router.put("/:id", auth, userCtrl.updateUser);
router.get("/", auth, userCtrl.getAllUsers);

module.exports = router;
