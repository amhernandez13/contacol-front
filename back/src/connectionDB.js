import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Carga las variables de entorno desde .env
dotenv.config();

// MongoDB connection
mongoose
  .connect(
    "mongodb+srv://david:1234@cluster0.6pqncbu.mongodb.net/testcloud?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then((data) => {
    console.log("Success conecting MongoDB");
  })
  .catch((error) => {
    console.log("Error conecting MongoDB");
    console.log(error);
  });

// Cloudinary DB connection
cloudinary.config({
  cloud_name: "dc6ulxdlx",
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export default cloudinary; // Exportar con esta linea para usar Cloudinary: import cloudinary from './cloudinaryConfig.js';

/* export default mongoose; */
