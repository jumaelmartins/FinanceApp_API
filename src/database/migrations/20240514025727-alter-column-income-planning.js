module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.changeColumn(
      "income_planning",
      "month",

      {
        type: Sequelize.DATEONLY,
        allowNull: false,
      }
    ),
  down: () => {},
};
