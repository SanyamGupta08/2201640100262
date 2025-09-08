"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("URLinfos", {
      shortendUrl: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
      originalUrl: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      creationTime: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      expiryTime: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      clicked: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("URLinfos");
  },
};
