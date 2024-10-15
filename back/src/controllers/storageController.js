// controllers/storageController.js
import storage from "../models/storageModel.js";
import cloudinary from "../connectionDB.js"; // Configuración de Cloudinary
import fs from "fs"; // Para eliminar archivos después de subirlos a Cloudinary

// Crear un nuevo documento con subida a Cloudinary
async function createStorage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("Archivo recibido desde el front:", req.file);

    const filePath = req.file.path;

    const uploadResult = await cloudinary.uploader.upload(filePath, {
      resource_type: "raw",
      folder: "facturas",
    });

    const newDocument = await storage.create({
      thirdParty: req.body.thirdParty,
      invoiceName: req.body.invoiceName,
      url: uploadResult.secure_url,
    });

    fs.unlinkSync(filePath);

    res.json({
      message: "File uploaded successfully",
      document: newDocument,
      url: uploadResult.secure_url,
    });
  } catch (err) {
    res.status(500).json({ error: "Server Error", message: err.message });
    console.error("Error al subir el archivo a Cloudinary:", err);
  }
}

// Obtener todos los documentos almacenados
async function listStorage(req, res) {
  try {
    const documents = await storage.find();
    res.json(documents);
  } catch (err) {
    res.status(500).json("Server error");
  }
}

// Obtener un documento por ID
async function listStorageByID(req, res) {
  try {
    const documentID = req.params.id;
    const documentRequested = await storage.findById(documentID);
    res.status(200).json(documentRequested);
  } catch (err) {
    console.error("Error al obtener el documento", err);
  }
}

// **Asegúrate de tener esta función definida**
async function updateStorage(req, res) {
  try {
    const documentModified = await storage.findById(req.params.id);

    if (!documentModified) {
      return res.status(404).json({ error: "Documento no encontrado" });
    }

    documentModified.thirdParty =
      req.body.thirdParty || documentModified.thirdParty;
    documentModified.invoiceName =
      req.body.invoiceName || documentModified.invoiceName;
    documentModified.url = req.body.url || documentModified.url;

    await documentModified.save();
    res.json(documentModified);
  } catch (err) {
    res.status(500).json({ error: "Server Error", message: err.message });
    console.error("Error al modificar el documento:", err);
  }
}

// Eliminar un documento por ID
async function deleteStorage(req, res) {
  try {
    await storage.findByIdAndDelete(req.params.id);
    res.json("Documento eliminado");
  } catch (err) {
    res.status(500).json({ error: "Server Error", message: err.message });
    console.error("Error al eliminar el documento:", err);
  }
}

export default {
  createStorage,
  listStorage,
  listStorageByID,
  updateStorage, // Asegúrate de exportar la función `updateStorage`
  deleteStorage,
};
