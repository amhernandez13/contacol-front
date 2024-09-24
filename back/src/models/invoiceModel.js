// Importamos el schema y el model de mongoose
import { Schema, model } from "mongoose";
// creamos el schema del formulario  con cada de sus nombres sus tipos de datos, si son 100% requeridos etc.
const esquma_facturas = new Schema({
  Emisión: { type: String, required: true },
  Fecha: { type: Date, required: true },
  Tipo_de_factura: { type: String, required: true },
  Método_de_pago: { type: String, required: true },
  Factura: { type: Number, required: true },
  Tercero: { type: String, required: true },
  Estado_de_factura: { type: Boolean, required: true },
  Fecha2: { type: Date, required: true },
  Descripción: { type: String, required: true },
  Medio_de_pago2: { type: String, required: true },
  Valor_pagado: { type: Number, required: true },
  Pagado2: { type: Boolean, required: true },
  Fecha4: { type: Date, required: true },
  T_Impuesto: { type: String, required: true },
  T_Factura: { type: String, required: true },
  Rte_Fuente: { type: String, required: true },
  Rte_IVA: { type: String, required: true },
  Rte_ICA: { type: String, required: true },
  Observación: { type: String, required: true },
  Departamento: { type: Selection, required: true },
  MunicipioCiudad: { type: Selection, required: true },
});

export default model("esqumea de factuas: ", esquma_facturas);
// No estoy muy familiarizado con el tema contable por lo que los campos cuyos datos no se de que tipo son los puse como strings y puse todos los campos como requeridos agradezco su comprensión gente :)
