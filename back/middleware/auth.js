const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
dotenv.config();
const TOKEN_KEY = process.env.TOKEN_KEY;

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, TOKEN_KEY);
    const userId = decodedToken.userId;
    const userRole = decodedToken.role;
    req.auth = { userId, userRole };
    if (req.body.userId && req.body.userId !== userId) {
      throw "ID invalide";
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error("Requête invalide !"),
    });
  }
};

//Rendre la connexion persistante
//https://www.primfx.com/json-web-token-jwt-guide-complet/rendre-connexion-persistante-refresh-token/
