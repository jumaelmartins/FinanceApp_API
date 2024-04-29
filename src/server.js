import app from "./app.js";

require("dotenv").config();

const port = process.env.SRV_PORT;

app.listen(port, () => {
  console.log(`Hello World! escutando na porta ${port}`);
});
