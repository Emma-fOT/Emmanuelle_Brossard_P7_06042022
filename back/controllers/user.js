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

// To register a user
exports.signup = (req, res, next) => {
  const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, { dialect: DB_DIALECT });
  if (!emailvalidator.validate(req.body.email)) {
    return res.status(401).json({ error: "Email non valide !" });
  }
  if (req.body.username.length < 3) {
    return res.status(401).json({ error: "Pseudo non valide. Il faut minimum 3 caractères." });
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
              sequelize.close();
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

// To log in a user
exports.login = (req, res, next) => {
  const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, { dialect: DB_DIALECT });
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
          sequelize.close();
          const userInfos = { userId: user.id, username: user.username, email: user.email, role: user.role };
          res.status(200).json({
            user: userInfos,
            token: jwt.sign(userInfos, TOKEN_KEY, {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

//To update a user profile
exports.updateUser = (req, res, next) => {
  const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, { dialect: DB_DIALECT });
  User(sequelize)
    .findOne({ where: { id: req.params.id } })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      if (user.id !== req.auth.userId) {
        return res.status(401).json({ error: "Impossible, vous n'êtes pas l'utilisateur ayant créé ce profil !" });
      }
      if (req.body.username.length < 3) {
        return res.status(401).json({ error: "Pseudo non valide. Il faut minimum 3 caractères." });
      }
      user
        .update({ username: req.body.username, email: req.body.email })
        .then(() => {
          sequelize.close();
          const userInfos = { userId: user.id, username: user.username, email: user.email, role: user.role };
          res.status(200).json({
            user: userInfos,
            token: jwt.sign(userInfos, TOKEN_KEY, {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => {
          // Error linked to the email, which has to be unique in the database
          error = error.errors[0].message;
          res.status(400).json({ error });
        });
    })
    .catch((error) => res.status(500).json({ error }));
};

//To update the password of a user
exports.updatePasswordUser = (req, res, next) => {
  const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, { dialect: DB_DIALECT });
  User(sequelize)
    .findOne({ where: { id: req.params.id } })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      if (user.id !== req.auth.userId) {
        return res.status(401).json({ error: "Impossible, vous n'êtes pas l'utilisateur ayant créé ce profil !" });
      }
      bcrypt.compare(req.body.currentPassword, user.password).then((valid) => {
        if (!valid) {
          return res.status(401).json({ error: "Mot de passe incorrect !" });
        }
        if (!passwordSchema.validate(req.body.newPassword)) {
          return res.status(401).json({
            error:
              "Nouveau mot de passe trop faible : il doit contenir au moins 8 caractères (dont au moins un chiffre, une majuscule, une minuscule et un caractère spécial) !",
          });
        } else {
          bcrypt
            .hash(req.body.newPassword, 10)
            .then((hash) => {
              user
                .update({ password: hash })
                .then(() => {
                  sequelize.close();
                  res.status(201).json({ message: "Mot de passe mis à jour !" });
                })
                .catch((error) => {
                  res.status(400).json({ error });
                });
            })
            .catch((error) => res.status(500).json({ error }));
        }
      });
    });
};

// To delete a user
exports.deleteUser = (req, res, next) => {
  const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, { dialect: DB_DIALECT });
  User(sequelize)
    .findOne({ where: { id: req.params.id } })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      if (user.id !== req.auth.userId) {
        if (req.auth.userRole !== "admin") {
          return res.status(401).json({ error: "Impossible, vous n'êtes pas l'utilisateur ayant créé ce profil !" });
        }
      }
      user
        .destroy()
        .then(() => {
          sequelize.close();
          res.status(200).json({
            message: "Profil supprimé !",
          });
        })
        .catch((error) => res.status(500).json({ error: error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// To get all users
exports.getAllUsers = (req, res, next) => {
  if (req.auth.userRole !== "admin") {
    return res.status(401).json({ error: "Impossible, seul un administrateur peut avoir accès à la liste des utilisateurs !" });
  }
  const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, { dialect: DB_DIALECT });
  const User = require("../models/user")(sequelize);
  User.findAll({ order: [["email", "ASC"]] })
    .then((users) => {
      sequelize.close();
      res.status(200).json(users);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
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
