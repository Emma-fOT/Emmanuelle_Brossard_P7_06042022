// Database infos
const DB_NAME = process.env.DB_NAME;
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_DIALECT = process.env.DB_DIALECT;
const Sequelize = require("sequelize");

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
  Post.create({
    postContent: req.body.postContent,
    dateTime: sequelize.fn("NOW"),
    userId: req.auth.userId,
  })
    .then(() => {
      sequelize.close();
      res.status(201).json({ message: "Post créé !" });
    })
    .catch((error) => res.status(400).json({ error }));
};

// To get all the posts of a user
exports.getOneUserPosts = (req, res, next) => {
  const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, { dialect: DB_DIALECT });
  const Post = require("../models/post")(sequelize);
  const User = require("../models/user")(sequelize);
  User.hasMany(Post);
  Post.belongsTo(User);
  //No control here: we let the possibility to get the posts of another user (not used yet in the app, but possible to use this in the future)
  Post.findAll({ include: User, where: { userId: req.params.id }, order: [["dateTime", "DESC"]] })
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

// To delete a post
exports.deletePost = (req, res, next) => {
  const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, { dialect: DB_DIALECT });
  const Post = require("../models/post")(sequelize);
  Post.findOne({ where: { id: req.params.id } })
    .then((post) => {
      if (!post) {
        return res.status(401).json({ error: "Post non trouvé !" });
      }
      if (req.auth.userRole !== "admin") {
        return res.status(401).json({ error: "Impossible, seul un administrateur peut supprimer un post !" });
      }
      post
        .destroy()
        .then(() => {
          sequelize.close();
          res.status(200).json({
            message: "Post supprimé !",
          });
        })
        .catch((error) => res.status(500).json({ error: error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
