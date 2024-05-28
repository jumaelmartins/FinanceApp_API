module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("expense_planning", "type_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "expense_type",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("expense_planning", "type_id");
  },
};
