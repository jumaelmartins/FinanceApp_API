module.exports = {
  up: async (queryInterface, Sequelize) =>
    await queryInterface.addColumn("expense_planning", "pay_method_id", {
      type: Sequelize.INTEGER,
      references: { model: "pay_methods", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      allowNull: true,
    }),
  down: () => {},
};
