module.exports = {
  up: async (queryInterface) => {
    return queryInterface.bulkInsert("expense_type", [
      {
        id: 1,
        type: "Despesas Fixas",
        user_id: 9001,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        type: "Despesas Variaveis",
        user_id: 9001,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: () => {},
};
