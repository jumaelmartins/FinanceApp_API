module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn(
      "expense_categories",
      "type_id",

      {
        type: Sequelize.INTEGER,
        references: { model: "expense_type", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        allowNull: false,
      }
    ),
  down: () => {},
};
