import express from "express";
require('dotenv').config()



const app = express();
const port = process.env.SRV_PORT

app.listen(port, () => {
   console.log(`Hello World! escutando na porta ${port}`)
})

