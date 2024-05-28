const bcryptjs = require("bcryptjs");
require("dotenv").config();
const password = process.env.SYSTEM_USER_PASSWORD;

module.exports = {
  up: async (queryInterface) => {
    return queryInterface.bulkInsert("users", [
      {
        id: process.env.SYSTEM_USER_ID,
        username: "system",
        email: process.env.SYSTEM_USER_EMAIL,
        password_hash: await bcryptjs.hash(password, 8),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: () => {},
};
