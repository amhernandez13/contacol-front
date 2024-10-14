import express from "express";
import cors from "cors";
import morgan from "morgan";
/* import userRouter from "./routers/userRouter.js";
import loginRouter from "./routers/loginRouter.js";
import storageRouter from "./routers/storageRouter.js";
 */
import supplierRouter from "./routers/supplierRouter.js";
import Router_invoice from "./routers/invoiceRouter.js";
/*
import invoiceRouter from "./routers/invoiceRouter.js"; // Todos fuera de corchetes porque está exportado por default
*/

const server = express();

server.use(cors());
server.use(express.json());
server.use(morgan("dev"));
/* server.use("/user", userRouter);
server.use("/login", loginRouter);
server.use("/invoice", invoiceRouter); 
server.use("/storage", storageRouter); */
server.use("/suppliers", supplierRouter);
server.use("/invoice", Router_invoice);


server.get("/", (sol, res) => {
  res.status(404).send("Not found, try /login on the URL");
});

export default server;
