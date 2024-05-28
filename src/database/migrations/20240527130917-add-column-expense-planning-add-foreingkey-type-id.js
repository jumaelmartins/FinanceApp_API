module.exports = {
  up: async (queryInterface, Sequelize) =>
    await queryInterface.addColumn("expense_planning", "description", {
      type: Sequelize.STRING,
      allowNull: true,
    }),
  down: () => {},
};
