import express from "express";
import supplierController from "../controllers/supplierController.js";

const router = express.Router();

//Obtener todos los proveedores
router.get("/", supplierController.listSuppliers);

//Obtener un proveedor por ID
router.get("/:id", supplierController.listSupplierByID);

//Crear un nuevo proveedor
router.post("/", supplierController.createSupplier);

//Modificar un proveedor
router.put("/:id", supplierController.updateSupplier);

//Eliminar un proveedor
router.delete("/:id", supplierController.deleteSupplier);

export default router;
