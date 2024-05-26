module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.changeColumn(
      "expense_planning",
      "month",

      {
        type: Sequelize.DATE,
        allowNull: false,
      }
    ),
  down: () => {},
};
