// Importamos el schema y el model de mongoose
import { Schema, model } from "mongoose";
// creamos el schema del formulario  con cada de sus nombres sus tipos de datos, si son 100% requeridos etc.
const esquma_facturas = new Schema({
  issue_date: { type: Date, required: true },
  invoice_type: { type: String, required: true },
  payment_method: { type: String, required: false },
  invoice: { type: String, required: true },
  thirt_party: { type: String, required: true },
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
});

export default model("esqumea de factuas: ", esquma_facturas);
// No estoy muy familiarizado con el tema contable por lo que los campos cuyos datos no se de que tipo son los puse como strings y puse todos los campos como requeridos agradezco su comprensión gente :)
