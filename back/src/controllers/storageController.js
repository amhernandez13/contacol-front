import storage from "../models/storageModel.js";
import cloudinary from "../connectionDB.js"; // Configuración de Cloudinary
import fs from "fs"; // Para eliminar archivos después de subirlos a Cloudinary
import path from "path"; // Para manejar rutas y nombres de archivo

// Función para sanitizar el nombre del archivo
function sanitizeFileName(filename) {
  return filename.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_\-\.]/g, "");
}

// Crear un nuevo documento con subida a Cloudinary
async function createStorage(req, res) {
  try {
    // Verificamos si se ha subido un archivo
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("Archivo recibido desde el front:", req.file);

    // Obtenemos la ruta completa del archivo
    const filePath = req.file.path;

    // Obtenemos el nombre original del archivo y lo sanitizamos
    let originalFileName = req.file.originalname;
    originalFileName = path.parse(originalFileName).name; // Elimina la extensión
    const sanitizedFileName = sanitizeFileName(originalFileName);

    // Subimos el archivo a Cloudinary como PDF, especificando el public_id
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      resource_type: "raw", // Especificamos que es un archivo raw (PDF)
      folder: "facturas", // Carpeta en Cloudinary
      public_id: sanitizedFileName, // Usamos el nombre original del archivo
      use_filename: true, // Usa el nombre del archivo
      unique_filename: false, // Para que no agregue caracteres adicionales
    });

    console.log("Archivo subido a Cloudinary:", uploadResult);

    // Generamos la URL del PDF con el flag 'inline'
    const pdfPublicId = uploadResult.public_id;

    const pdfUrl = cloudinary.url(pdfPublicId, {
      resource_type: "raw",
      type: "upload",
      secure: true,
      flags: "inline", // Especificamos el flag 'inline' para visualizar en línea
    });

    console.log("URL del PDF:", pdfUrl);

    // Creamos el documento en la base de datos con la URL generada
    const newDocument = await storage.create({
      thirdParty: req.body.thirdParty,
      invoiceName: req.body.invoiceName,
      url: pdfUrl, // Usamos la URL generada con el flag 'inline'
    });

    console.log("Documento creado en la base de datos:", newDocument);

    // Eliminamos el archivo local después de subirlo a Cloudinary
    fs.unlinkSync(filePath);

    // Respondemos con la URL al frontend
    res.json({
      message: "File uploaded successfully",
      url: pdfUrl, // Enviamos la URL al frontend para que se use después
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
    res.status(500).json({ error: "Server Error", message: err.message });
    console.error("Error al listar los documentos:", err);
  }
}

// Obtener un documento por ID
async function listStorageByID(req, res) {
  try {
    const documentID = req.params.id;
    const documentRequested = await storage.findById(documentID);

    if (!documentRequested) {
      return res.status(404).json({ error: "Documento no encontrado" });
    }

    res.status(200).json(documentRequested);
  } catch (err) {
    res.status(500).json({ error: "Server Error", message: err.message });
    console.error("Error al obtener el documento:", err);
  }
}

// Actualizar un documento por ID
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
    const documentToDelete = await storage.findById(req.params.id);

    if (!documentToDelete) {
      return res.status(404).json({ error: "Documento no encontrado" });
    }

    await storage.findByIdAndDelete(req.params.id);
    res.json({ message: "Documento eliminado" });
  } catch (err) {
    res.status(500).json({ error: "Server Error", message: err.message });
    console.error("Error al eliminar el documento:", err);
  }
}

export default {
  createStorage,
  listStorage,
  listStorageByID,
  updateStorage,
  deleteStorage,
};
