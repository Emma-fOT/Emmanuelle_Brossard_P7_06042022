const express = require("express");
const router = express.Router();

const postCtrl = require("../controllers/post");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

router.get("/", auth, postCtrl.getAllPosts);
router.post("/", auth, multer, postCtrl.createPost);
//Old route: router.post("/", auth, postCtrl.createPost);
router.get("/:id", auth, postCtrl.getOneUserPosts);
router.delete("/:id", auth, postCtrl.deletePost);

module.exports = router;
