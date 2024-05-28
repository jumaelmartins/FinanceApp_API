module.exports = {
  up: async (queryInterface) => {
    return queryInterface.bulkInsert("pay_methods", [
      {
        id: 1,
        method: "Cartão de Crédito",
        user_id: 9001,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        method: "Pix",
        user_id: 9001,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        method: "Boleto",
        user_id: 9001,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: () => {},
};
