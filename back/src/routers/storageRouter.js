import express from "express";
import storageController from "../controllers/storageController.js";

const router = express.Router();

//Obtener todas las facturas
router.get("/", storageController.listStorage);

//Obtener una factura por ID
router.get("/:id", storageController.listStorageByID);

//Crear una nueva factura
router.post("/", storageController.createStorage);

//Modificar una factura
router.put("/:id", storageController.updateStorage);

//Eliminar una factura
router.delete("/:id", storageController.deleteStorage);

// Subir un archivo PDF y crear el documento
router.post("/", upload.single("file"), storageController.createStorage); // Usamos el middleware de Multer

export default router;
