module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable("expense_planning", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      month: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        allowNull: false,
      },
      category_id: {
        type: Sequelize.INTEGER,
        references: { model: "expense_categories", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
        allowNull: true,
      },
      planned_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    }),
  down: (queryInterface, Sequelize) =>
    queryInterface.dropTable("expense_planning"),
};
