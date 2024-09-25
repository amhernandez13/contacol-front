import supplier from "../models/supplierModel.js";

//Solicitar la lista de todos los proveedores
async function listSuppliers(req, res) {
  try {
    const suppliers = await supplier.find();
    res.json(suppliers);
  } catch (err) {
    res.status(500).json("Server error");
  }
}

//Solicitar la informacion de UN proveedor
async function listSupplierByID(req, res) {
  try {
    const supplierID = req.params.id;
    const supplierRequested = await supplier.findById(supplierID);
    res.status(200).json(supplierRequested);
  } catch (err) {
    console.error("Error al obtener el proveedor", err);
  }
}

//Crear un proveedor
async function createSupplier(req, res) {
  try {
    const newSupplier = await supplier.create({
      thirdParty: req.body.thirdParty,
      nit: req.body.nit,
      department: req.body.department,
      city: req.body.city,
      email: req.body.email,
      phone: req.body.phone,
    });
    res.json(newSupplier);
  } catch (err) {
    res.status(500).json({ error: "Server Error", message: err.message });
    console.error("Error al crear el proveedor:", err);
  }
}

//Modificar parcialmente un proveedor
async function updateSupplier(req, res) {
  try {
    const supplierModified = await supplier.findById(req.params.id);
    supplierModified.thirdParty =
      req.body.thirdParty || supplierModified.thirdParty;
    supplierModified.nit = req.body.nit || supplierModified.nit;
    supplierModified.department =
      req.body.department || supplierModified.department;
    supplierModified.city = req.body.city || supplierModified.city;
    supplierModified.email = req.body.email || supplierModified.email;
    supplierModified.phone = req.body.phone || supplierModified.phone;

    await supplierModified.save();
    res.json(supplierModified);
  } catch (err) {
    res.status(500).json({ error: "Server Error", message: err.message });
  }
}

//Eliminar un proveedor
async function deleteSupplier(req, res) {
  try {
    await supplier.findByIdAndDelete(req.params.id);
    res.json("Supplier deleted");
  } catch (err) {
    res.status(500).json({ error: "Server Error", message: err.message });
    console.error("Error al eliminar el proveedor:", err);
  }
}

export default {
  listSuppliers,
  listSupplierByID,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};
