import mongoose from "mongoose";

//Esquema de Storage
const storageSchema = new mongoose.Schema({
  thirdParty: {
    type: String,
    required: false,
  },
  invoiceName: {
    type: String,
    required: false,
  },
  url: {
    type: String,
    required: false,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
});

const storage = mongoose.model("storage", storageSchema);

export default storage;
