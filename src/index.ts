import express from "express";
import router from "./routes/facesRoutes";
require('dotenv').config();
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', router);
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const HOST = "192.168.1.3";


app.listen(PORT, HOST, ()=>{
  console.log(`Server running at http://${HOST}:${PORT}/`);
})