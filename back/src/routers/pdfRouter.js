import express from "express";
import Pdf_controller from "../controllers/pdfController.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

// Ruta para subir el PDF y extraer los datos (aceptar cualquier archivo)
router.post("/upload-pdf", upload.any(), Pdf_controller.extract_pdf_data);

export default router;
