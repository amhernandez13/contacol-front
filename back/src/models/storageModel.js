import mongoose from "mongoose";

//Esquema de Storage
const storageSchema = new mongoose.Schema({
  thirdParty: {
    type: String,
    required: true,
  },
  invoiceName: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
});

const storage = mongoose.model("storage", storageSchema);

export default storage;
