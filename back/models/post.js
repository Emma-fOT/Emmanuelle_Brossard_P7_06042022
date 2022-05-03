module.exports = (sequelize) => {
  const DataTypes = require("sequelize");
  const User = sequelize.define(
    "post",
    {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
      },
      postContent: {
        type: DataTypes.TEXT,
      },
      imageUrl: { type: DataTypes.TEXT },
      dateTime: {
        type: DataTypes.DATE,
      },
      userId: {
        type: DataTypes.INTEGER,
        // references: {
        //   model: "User",
        //   key: "id",
        // },
      },
    },
    {
      timestamps: false,
    }
  );
  return User;
};
