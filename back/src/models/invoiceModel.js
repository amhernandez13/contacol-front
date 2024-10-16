import { Schema, model } from "mongoose";

// Esquema del formulario de facturas
const esquma_facturas = new Schema({
  issue_date: { type: Date, required: true },
  invoice_type: { type: String, required: true },
  payment_method: { type: String, required: false },
  invoice: { type: String, required: true },
  third_party: { type: String, required: true },
  invoice_status: { type: String, required: true },
  due_date: { type: Date, required: false },
  description: { type: String, required: true },
  payment_way: { type: String, required: true },
  paid_value: { type: Number, required: false },
  payment_date: { type: Date, required: false },
  payment: {
    taxes_total: { type: Number, required: false },
    invoice_total: { type: Number, required: true },
    rte_fuente: { type: Number, required: false },
    rte_iva: { type: Number, required: false },
    rte_ica: { type: Number, required: false },
  },
  observation: { type: String, required: false },
  department: { type: String, required: false },
  city: { type: String, required: false },
  url: { type: String, required: false }, // Campo para almacenar la URL del PDF en Cloudinary
  supplier: { type: String, required: true },
});

export default model("Invoice", esquma_facturas);
