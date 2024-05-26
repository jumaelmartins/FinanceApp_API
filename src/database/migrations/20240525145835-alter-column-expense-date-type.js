module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.changeColumn(
      "expenses",
      "date",

      {
        type: Sequelize.DATE,
        allowNull: false,
      }
    ),
  down: () => {},
};
