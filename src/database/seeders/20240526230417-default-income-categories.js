module.exports = {
  up: async (queryInterface) => {
    return queryInterface.bulkInsert("income_categories", [
      {
        id: 1,
        category_name: "Salario",
        user_id: 9001,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        category_name: "Alugueis",
        user_id: 9001,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        category_name: "Investimentos",
        user_id: 9001,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 4,
        category_name: "Outros",
        user_id: 9001,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: () => {},
};
