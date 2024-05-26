module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable("expense_categories", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      category_name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
    queryInterface.dropTable("expense_categories"),
};

