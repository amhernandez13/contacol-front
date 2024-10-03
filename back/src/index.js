import dotenv from "dotenv";
import "./connectionDB.js";
import server from "./server.js";

// Carga las variables de entorno desde el archivo .env
dotenv.config();
server.listen(3000);
console.log("Server Port: 3000");
