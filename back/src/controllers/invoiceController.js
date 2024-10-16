import invoiceModel from "../models/invoiceModel.js";

const Invoice_controller = {
  create_invoice: async (req, res) => {
    try {
      const issue_date = req.body.issue_date || null;
      const invoice_type = req.body.invoice_type || "";
      const payment_method = req.body.payment_method || "";
      const invoice = req.body.invoice || "";
      const third_party = req.body.third_party || "";
      const invoice_status = req.body.invoice_status || "";
      const due_date = req.body.due_date || null;
      const description = req.body.description || "";
      const payment_way = req.body.payment_way || "";
      const paid_value = req.body.paid_value || 0;
      const payment_date = req.body.payment_date || null;
      const observation = req.body.observation || "";
      const department = req.body.department || "";
      const city = req.body.city || "";
      const supplier = req.body.supplier || "";

      // Aquí recibimos la URL del archivo PDF desde Cloudinary
      const url = req.body.url || "";

      // Aseguramos que los valores de payment estén bien extraídos
      const {
        taxes_total = 0,
        invoice_total = 0,
        rte_fuente = 0,
        rte_ica = 0,
        rte_iva = 0,
      } = req.body.payment || {}; // Accedemos a req.body.payment directamente

      // Creamos el nuevo objeto para la factura
      const newInvoice = new invoiceModel({
        issue_date,
        invoice_type,
        payment_method,
        invoice,
        third_party,
        invoice_status,
        due_date,
        description,
        payment_way,
        paid_value,
        payment_date,
        payment: {
          taxes_total,
          invoice_total,
          rte_fuente,
          rte_iva,
          rte_ica,
        }, // Aseguramos que estos valores se guarden correctamente en la base de datos
        observation,
        department,
        city,
        supplier,
        url, // Guardamos la URL de Cloudinary aquí
      });

      // Guardamos la factura en la base de datos
      const Invoice_created = await newInvoice.save();

      if (Invoice_created._id) {
        res.json({
          result: "Good",
          message: "Invoice created successfully",
          data: Invoice_created,
        });
      }
    } catch (error) {
      res.json({
        error: true,
        message: "An error has occurred while creating the invoice",
      });
      console.log(error);
    }
  },

  // Obtener una factura por ID
  read_Invoice: async (req, res) => {
    try {
      const invoice_Found = await invoiceModel.findById(req.params.id);
      if (invoice_Found._id) {
        res.json({
          result: "Good",
          message: "Invoice retrieved successfully",
          data: invoice_Found,
        });
      }
    } catch (error) {
      res.json({
        result: "Ups",
        message: "An error occurred while retrieving the invoice",
      });
    }
  },

  // Obtener todas las facturas
  read_invoices: async (req, res) => {
    try {
      const invoices = await invoiceModel.find();
      if (invoices) {
        res.json({
          result: "Good",
          message: "Invoices retrieved successfully",
          data: invoices,
        });
      }
    } catch (error) {
      res.json({
        error: true,
        message: "An error occurred while retrieving invoices",
      });
    }
  },

  // Eliminar una factura por ID
  delete_Invoice: async (req, res) => {
    try {
      const Delete = await invoiceModel.findByIdAndDelete(req.params.id);
      if (Delete._id) {
        res.json({
          result: "Good",
          message: "Invoice deleted",
        });
      }
    } catch (error) {
      res.json({
        result: "Ups",
        message: "An error occurred while deleting the invoice",
      });
    }
  },

  // Actualizar una factura por ID
  update_invoice: async (req, res) => {
    try {
      const { id } = req.params;

      const update_invo = {
        issue_date: req.body.issue_date,
        invoice_type: req.body.invoice_type,
        payment_method: req.body.payment_method,
        invoice: req.body.invoice,
        third_party: req.body.third_party,
        invoice_status: req.body.invoice_status,
        due_date: req.body.due_date,
        description: req.body.description,
        payment_way: req.body.payment_way,
        paid_value: req.body.paid_value,
        payment_date: req.body.payment_date,
        payment: req.body.payment, // Actualizamos el objeto payment completo
        taxes_total: req.body.taxes_total,
        invoice_total: req.body.invoice_total,
        rte_fuente: req.body.rte_fuente,
        rte_iva: req.body.rte_iva,
        rte_ica: req.body.rte_ica,
        observation: req.body.observation,
        department: req.body.department,
        city: req.body.city,
        supplier: req.body.supplier,
        url: req.body.url, // Actualizar la URL si es necesario
      };

      const invoice_updated = await invoiceModel.findByIdAndUpdate(
        id,
        update_invo,
        { new: true }
      );

      if (invoice_updated._id) {
        res.json({
          result: "nice",
          message: "Invoice updated",
          data: invoice_updated,
        });
      }
    } catch (error) {
      res.json({
        result: "Ups, an error has occurred",
        message: "An error occurred while updating the invoice",
      });
    }
  },
};

export default Invoice_controller;
