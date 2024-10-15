import storage from "../models/storageModel.js";

// Solicitar la lista de todos los PDF
async function listStorage(req, res) {
  try {
    const documents = await storage.find();
    res.json(documents);
  } catch (err) {
    res.status(500).json("Server error");
  }
}

// Solicitar un documento por ID
async function listStorageByID(req, res) {
  try {
    const documentID = req.params.id;
    const documentRequested = await storage.findById(documentID);
    res.status(200).json(documentRequested);
  } catch (err) {
    console.error("Error al obtener el documento", err);
  }
}

// Crear un nuevo documento
async function createStorage(req, res) {
  try {
    const newDocument = await storage.create({
      thirdParty: req.body.thirdParty,
      invoiceName: req.body.invoiceName,
      url: req.body.url, // la url debe venir o desde multer o desde cloudinary
    });
    res.json(newDocument);
  } catch (err) {
    res.status(500).json({ error: "Server Error", message: err.message });
    console.error("Error al crear el documento:", err);
  }
}

// Modificar parcialmente un documento (si lo deseas)
async function updateStorage(req, res) {
  try {
    const documentModified = await storage.findById(req.params.id);
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

// Eliminar un documento
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
  listStorage,
  listStorageByID,
  createStorage,
  updateStorage,
  deleteStorage,
};
