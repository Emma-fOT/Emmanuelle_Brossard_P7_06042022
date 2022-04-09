const Post = require("../models/post");

// Database infos
const DB_NAME = process.env.DB_NAME;
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_DIALECT = process.env.DB_DIALECT;
const Sequelize = require("sequelize");

exports.getAllPosts = (req, res, next) => {
  const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, { dialect: DB_DIALECT }); // ??? Open the connexion for each request ???

  Post(sequelize)
    .findAll({})
    .then((posts) => {
      sequelize.close(); // ??? Close the connexion after each request ???
      res.status(200).json(posts);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.createPost = (req, res, next) => {
  const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, { dialect: DB_DIALECT }); // ??? Open the connexion for each request ???
  Post(sequelize)
    .create({
      postContent: req.body.postContent,
      dateTime: sequelize.fn("NOW"),
      userId: req.auth.userId,
    })
    .then(() => {
      sequelize.close(); // ??? Close the connexion after each request ???
      res.status(201).json({ message: "Post créé !" });
    })
    .catch((error) => res.status(400).json({ error }));
};
