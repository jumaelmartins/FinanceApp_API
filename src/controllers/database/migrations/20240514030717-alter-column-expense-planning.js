module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.changeColumn(
      "expense_planning",
      "month",

      {
        type: Sequelize.DATEONLY,
        allowNull: false,
      }
    ),
  down: () => {},
};
