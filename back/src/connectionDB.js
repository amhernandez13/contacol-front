import mongoose from "mongoose";
import dotenv from "dotenv";

// Cargar el archivo .env
dotenv.config();

console.log(process.env.MONGO_ENDPOINT);
mongoose
  .connect(
    "mongodb+srv://david:1234@cluster0.6pqncbu.mongodb.net/testcloud?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then((data) => {
    console.log("Success conecting DB");
  })
  .catch((error) => {
    console.log(error);
    console.log("Error conecting DB");
  });

/* export default mongoose; */
