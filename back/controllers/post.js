// Database infos
const DB_NAME = process.env.DB_NAME;
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_DIALECT = process.env.DB_DIALECT;
const Sequelize = require("sequelize");
const fs = require("fs");

// To get all posts
exports.getAllPosts = (req, res, next) => {
  const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, { dialect: DB_DIALECT });
  const Post = require("../models/post")(sequelize);
  const User = require("../models/user")(sequelize);
  User.hasMany(Post);
  Post.belongsTo(User);
  Post.findAll({ include: User, order: [["dateTime", "DESC"]] })
    .then((posts) => {
      sequelize.close();
      res.status(200).json(posts);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

// To create one post
exports.createPost = (req, res, next) => {
  const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, { dialect: DB_DIALECT });
  const Post = require("../models/post")(sequelize);
  let imageUrl;
  if (req.file === undefined) {
    imageUrl = "";
  } else {
    imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
  }
  Post.create({
    postContent: req.body.postContent,
    dateTime: sequelize.fn("NOW"),
    userId: req.auth.userId,
    imageUrl: imageUrl,
  })
    .then(() => {
      sequelize.close();
      res.status(201).json({ message: "Post créé !" });
    })
    .catch((error) => res.status(400).json({ error }));
};

// To delete a post
exports.deletePost = (req, res, next) => {
  const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, { dialect: DB_DIALECT });
  const Post = require("../models/post")(sequelize);
  Post.findOne({ where: { id: req.params.id } })
    .then((post) => {
      if (!post) {
        return res.status(401).json({ error: "Post non trouvé !" });
      }
      if (req.auth.userRole !== "admin" && post.userId !== req.auth.userId) {
        return res.status(401).json({ error: "Vous n'avez pas les droits pour supprimer ce post !" });
      }
      const filename = post.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        post
          .destroy()
          .then(() => {
            sequelize.close();
            res.status(200).json({
              message: "Post supprimé !",
            });
          })
          .catch((error) => res.status(500).json({ error: error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};
