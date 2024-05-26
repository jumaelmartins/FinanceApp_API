import app from "./app.js";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.SRV_PORT;

app.listen(port, () => {
  console.log(`Hello World! escutando na porta ${port}`);
});
