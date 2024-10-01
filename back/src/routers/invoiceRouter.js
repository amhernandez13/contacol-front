import { Router } from "express";
import Invoice_controller from "../controllers/invoiceController.js";

const Router_invoice = Router();
Router_invoice.get("/:id", Invoice_controller.read_Invoice);
Router_invoice.post("/", Invoice_controller.create_invoice);
Router_invoice.get("/", Invoice_controller.read_invoices);
Router_invoice.delete("/:id", Invoice_controller.read_Invoice);

export default Router_invoice;
