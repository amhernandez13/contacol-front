import mongoose from "mongoose";

//Esquema de Supplier
const supplierSchema = new mongoose.Schema({
  thirdParty: {
    type: String,
    required: true,
  },
  nit: {
    type: String,
    required: true,
    unique: true,
  },
  department: String,
  city: String,
  email: {
    type: String,
    match: [/\S+@\S+\.\S+/, "Correo inválido"],
  },
  phone: {
    type: String,
    match: [/^\d+$/, "Número de teléfono inválido"],
  },
});

const supplier = mongoose.model("supplier", supplierSchema);

export default supplier;
