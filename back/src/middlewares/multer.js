import multer from "multer";
import path from "path";

// Configuración de almacenamiento de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Guardar el archivo en la carpeta especificada
    cb(null, "D:\\Equipo-25\\back\\test\\data\\");
  },
  filename: (req, file, cb) => {
    // Guardar siempre con el nombre específico "05-versions-space.pdf"
    cb(null, "05-versions-space.pdf");
  },
});

// Filtro para asegurar que solo se suban archivos PDF
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true); // Solo permitir archivos PDF
  } else {
    cb(new Error("Solo se permiten archivos PDF"), false);
  }
};

// Inicializar Multer con la configuración de almacenamiento y el filtro de archivos
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

export default upload;
