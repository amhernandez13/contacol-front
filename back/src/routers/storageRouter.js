// routers/storageRouter.js
import express from "express";
import storageController from "../controllers/storageController.js"; // Asegúrate de importar todas las funciones del controlador
import upload from "../middlewares/multer.js"; // Middleware de Multer para manejar la subida de archivos

const router = express.Router();

// Ruta para subir un archivo PDF
router.post("/", upload.single("file"), storageController.createStorage);

// Obtener todas las facturas (PDFs)
router.get("/", storageController.listStorage);

// Obtener una factura por ID
router.get("/:id", storageController.listStorageByID);

// Asegúrate de tener definida la función `updateStorage` en el controlador
router.put("/:id", storageController.updateStorage);

// Eliminar una factura por ID
router.delete("/:id", storageController.deleteStorage);

export default router;
