import invoiceModel from "../models/invoiceModel.js";

const Invoice_controller = {
  create_invoice: async (req, res) => {
    try {
      const issue_date = req.body.issue_date;
      const invoice_type = req.body.invoice_type;
      const payment_method = req.body.payment_method;
      const invoice = req.body.invoice;
      const thirt_party = req.body.thirt_party;
      const invoice_status = req.body.invoice_status;
      const due_date = req.body.due_date;
      const description = req.body.description;
      const payment_way = req.body.payment_way;
      const paid_value = req.body.paid_value;
      const payment_date = req.body.payment_date;

      const {
        payment,
        invoice_total,
        taxes_total,
        rte_fuente,
        rte_ica,
        rte_iva,
      } = req.body;

      const observation = req.body.observation;
      const department = req.body.department;
      const city = req.body.city;

      const newInvoice = new invoiceModel({
        issue_date,
        invoice_type,
        payment_method,
        invoice,
        thirt_party,
        invoice_status,
        due_date,
        description,
        payment_way,
        paid_value,
        payment_date,
        payment,
        taxes_total,
        invoice_total,
        rte_fuente,
        rte_iva,
        rte_ica,
        observation,
        department,
        city,
      });
      const Invoice_created = await newInvoice.save();

      console.log("req body", req.body);
      if (Invoice_created._id) {
        res.json({
          resoult: "Good",
          message: "Creating invoice",
          data: null,
        });
      }
    } catch (error) {
      res.json({ error: true, message: "an error has ocurred " });
      console.log(error);
      console.log(typeof req.body.payment.thirt_party);
    }
  },

  read_Invoice: async (req, res) => {
    try {
      const invoice_Found = await invoiceModel.findById(req.params.id);
      if (invoice_Found._id) {
        res.json({
          resoult: "Good",
          message: "The invoice has been read correctly",
          dato: invoice_Found,
        });
      }
    } catch (error) {
      res.json({
        resoult: "Ups",
        message: "An error has ocurred",
      });
    }
  },

  read_invoices: async (req, res) => {
    try {
      const invoice_Found = await invoiceModel.find();

      if (invoice_Found) {
        res.json({
          resoult: "Good",
          message: "Reading invoices",
          data: null,
        });
      }
    } catch (error) {
      res.json({ error: true, message: "An error has ocurred " });
    }
  },

  delete_Invoice: async (req, res) => {
    try {
      const Delete = await invoiceModel.findOneAndDelete(req.params.id);
      if (Delete._id) {
        res.json({
          resoult: "Good",
          message: "Invoice deleted",
          data: null,
        });
      }
    } catch (error) {
      res.json({
        resoult: "Ups",
        message: "An error has ocurred",
      });
    }
  },
};

export default Invoice_controller;
