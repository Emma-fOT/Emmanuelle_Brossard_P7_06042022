const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const TOKEN_KEY = process.env.TOKEN_KEY;

const bcrypt = require("bcrypt");

const emailvalidator = require("email-validator");
const passwordValidator = require("password-validator");
let passwordSchema = new passwordValidator();
passwordSchema.is().min(8).is().max(50).has().uppercase().has().lowercase().has().digits().has().not().spaces().has().symbols();

const User = require("../models/User");

// Database infos
const DB_NAME = process.env.DB_NAME;
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_DIALECT = process.env.DB_DIALECT;
const Sequelize = require("sequelize");

exports.signup = (req, res, next) => {
  const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, { dialect: DB_DIALECT }); // ??? Open the connexion for each request ???
  if (!emailvalidator.validate(req.body.email)) {
    return res.status(401).json({ error: "Email non valide !" });
  } else {
    if (!passwordSchema.validate(req.body.password)) {
      return res.status(401).json({
        error:
          "Mot de passe trop faible : il doit contenir au moins 8 caractères (dont au moins un chiffre, une majuscule, une minuscule et un caractère spécial) !",
      });
    } else {
      bcrypt
        .hash(req.body.password, 10)
        .then((hash) => {
          User(sequelize)
            .create({
              username: req.body.username,
              email: req.body.email,
              password: hash,
            })
            .then(() => {
              sequelize.close(); // ??? Close the connexion after each request ???
              res.status(201).json({ message: "Utilisateur créé !" });
            })
            .catch((error) => {
              error = error.errors[0].message;
              res.status(400).json({ error });
            });
        })
        .catch((error) => res.status(500).json({ error }));
    }
  }
};

exports.login = (req, res, next) => {
  const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, { dialect: DB_DIALECT }); // ??? Open the connexion for each request ???
  User(sequelize)
    .findOne({ where: { email: req.body.email } })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          sequelize.close(); // ??? Close the connexion after each request ???
          res.status(200).json({
            userId: user.id,
            token: jwt.sign({ userId: user.id }, TOKEN_KEY, { expiresIn: "24h" }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
