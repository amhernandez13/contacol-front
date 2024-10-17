import { Router } from "express";
import Invoice_controller from "../controllers/invoiceController.js";
import upload from "../middlewares/multer.js"; // Middleware de Multer

const Router_invoice = Router();
Router_invoice.get("/:id", Invoice_controller.read_Invoice);
Router_invoice.post(
  "/",
  upload.single("invoiceFile"),
  Invoice_controller.create_invoice
); // Subida de PDF
Router_invoice.get("/", Invoice_controller.read_invoices);
Router_invoice.delete("/:id", Invoice_controller.delete_Invoice);
Router_invoice.put("/:id", Invoice_controller.upadate_invoice);

export default Router_invoice;
