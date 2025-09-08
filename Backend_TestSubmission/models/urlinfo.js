"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class URLinfo extends Model {
    static associate(models) {
      // define associations here if needed
    }
  }

  URLinfo.init(
    {
      shortendUrl: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      originalUrl: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      creationTime: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      expiryTime: {
        type: DataTypes.DATE,
      },
      clicked: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "URLinfo",
      tableName: "URLinfos",
      timestamps: true, // createdAt and updatedAt enabled
    }
  );

  return URLinfo;
};
