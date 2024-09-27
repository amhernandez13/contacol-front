// Importamos el schema y el model de mongoose
import { Schema, model } from "mongoose";
// creamos el schema del formulario  con cada de sus nombres sus tipos de datos, si son 100% requeridos etc.
const esquma_facturas = new Schema({
  Emission: { type: String, required: true },
  date: { type: Date, required: true },
  Type_of_invoice: { type: String, required: true },
  Payment_method: { type: String, required: true },
  Invoice: { type: Number, required: true },
  Thirth_person: { type: String, required: true },
  Invoice_status: { type: Boolean, required: true },
  date2: { type: Date, required: true },
  Description: { type: String, required: true },
  Payment_method2: { type: String, required: true },
  Paid_value: { type: Number, required: true },
  Paid2: { type: Boolean, required: true },
  date3: { type: Date, required: true },
  T_taxes: { type: String, required: true },
  T_Invoice: { type: String, required: true },
  Rte_Fount: { type: String, required: true },
  Rte_IVA: { type: String, required: true },
  Rte_ICA: { type: String, required: true },
  Observation: { type: String, required: true },
  Department: { type: Selection, required: true },
  MunicipioCity: { type: Selection, required: true },
});

export default model("esqumea de factuas: ", esquma_facturas);
// No estoy muy familiarizado con el tema contable por lo que los campos cuyos datos no se de que tipo son los puse como strings y puse todos los campos como requeridos agradezco su comprensión gente :)
