const express = require("express");

const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");

//Express framework
const app = express();
app.use(express.json());

// To limit the number of requests
const rateLimit = require("express-rate-limit");
const LimitOfAttempts = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(LimitOfAttempts);

// To avoid CORS errors (Cross-Origin Resource Sharing) - front and back on different servers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});

//ORM (Object Relational Mapping) Sequelize
// Documentation: https://sequelize.org/docs/v6/

const dotenv = require("dotenv");
dotenv.config();
const DB_NAME = process.env.DB_NAME;
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_DIALECT = process.env.DB_DIALECT;

const mysql = require("mysql2/promise");
const Sequelize = require("sequelize");

initialize();

async function initialize() {
  // Create a database if it doesn't already exist
  const connection = await mysql.createConnection({
    host: DB_HOST,
    port: process.env.DB_PORT || "3306",
    user: DB_USERNAME,
    password: DB_PASSWORD,
  });
  await connection
    .query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`)
    .then(() => {
      // Connect to the database
      const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, { dialect: DB_DIALECT });
      console.log("Connexion ou création de la base de données : ok");

      try {
        // Initialize models and associations
        let eachUser = require("./models/user")(sequelize);
        let eachPost = require("./models/post")(sequelize);
        // https://sequelize.org/docs/v6/core-concepts/assocs/
        // We want that the posts of a user will be deleted if the user is deleted > onDelete: "CASCADE"
        eachUser.hasMany(eachPost, { onDelete: "CASCADE", onUpdate: "CASCADE" });
        eachPost.belongsTo(eachUser);
        console.log("Initialisation des modèles : ok");
      } catch {
        console.log("Problème lors de l'initialisation des modèles !");
      }

      // Sync all models with database
      sequelize
        .sync() // This creates the table if it doesn't exist (and does nothing if it already exists)
        //User.sync({ force: true }) - This creates the table, dropping it first if it already existed
        .then(() => {
          console.log("Création des tables (si nécessaire) : ok.");
        })
        .catch(() => console.log("Problème lors de la création des tables !"))
        .finally(() => {
          sequelize.close(); // ???
        });
    })
    .catch(() => {
      console.log("Problème à la connexion ou à création de la base de données.");
    });
}

app.use("/api/auth", userRoutes);
app.use("/api/posts", postRoutes);

module.exports = app;
