import mongoose from "mongoose";
import dotenv from "dotenv";

// Cargar el archivo .env
dotenv.config();

console.log(process.env.MONGO_ENDPOINT);
mongoose
  .connect(process.env.MONGO_ENDPOINT)
  .then((data) => {
    console.log("Success conecting DB");
  })
  .catch((error) => {
    console.log("Error conecting DB");
  });

/* export default mongoose; */
