module.exports = (sequelize) => {
  const DataTypes = require("sequelize");
  const User = sequelize.define(
    "user",
    {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: "Un compte existe déjà pour cette adresse mail. Veuillez en choisir une autre.",
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: "subscriber",
      },
    },
    {
      timestamps: false,
    }
  );
  return User;
};
