import invoiceModel from "../models/invoiceModel.js";

const Invoice_controller = {
  create_invoice: async (solicitud, respuesta) => {
    try {
      const issue_date = solicitud.body.issue_date;
      const invoice_type = solicitud.body.invoice_type;
      const payment_method = solicitud.body.payment_method;
      const invoice = solicitud.body.invoice;
      const thirth_party = solicitud.body.thirth_party;
      const invoice_status = solicitud.body.invoice_status;
      const due_date = solicitud.body.due_date;
      const description = solicitud.body.description;
      const payment_way = solicitud.body.payment_way;
      const paid_value = solicitud.body.paid_value;
      const payment_date = solicitud.body.payment_date;
      const taxes_total = solicitud.body.taxes_total;
      const invoice_total = solicitud.body.invoice_total;
      const rte_fuente = solicitud.body.rte_fuente;
      const rte_iva = solicitud.body.rte_iva;
      const rte_ica = solicitud.body.rte_ica;
      const observation = solicitud.body.observation;
      const department = solicitud.body.department;
      const city = solicitud.body.city;

      const newInvoice = new invoiceModel({
        issue_date,
        invoice_type,
        payment_method,
        invoice,
        thirth_party,
        invoice_status,
        due_date,
        description,
        payment_way,
        paid_value,
        payment_date,
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

      console.log("solicitud body", solicitud.body);
      if (Invoice_created._id) {
        respuesta.json({
          resultado: "bien",
          mensaje: "creando factura",
          datos: null,
        });
      }
    } catch (error) {
      respuesta.json({ error: true, mensaje: "ha ocurrido un error " });
    }
  },

  read_Invoice: async (solicitud, respuesta) => {
    try {
      const invoice_Found = await invoiceModel.findById(solicitud.params.id);
      if (invoice_Found._id) {
        respuesta.json({
          resultado: "bien",
          mensaje: "la factura fue leida correctamente",
          dato: invoice_Found,
        });
      }
    } catch (error) {
      respuesta.json({
        resultado: "mal",
        mensaje: "Hubo un error",
      });
    }
  },

  read_invoices: async (solicitud, respuesta) => {
    try {
      const invoice_Found = await invoiceModel.find();

      if (invoice_Found) {
        respuesta.json({
          resultado: "bien",
          mensaje: "Leyendo facturas",
          datos: null,
        });
      }
    } catch (error) {
      respuesta.json({ error: true, mensaje: "ha ocurrido un error " });
    }
  },

  delete_Invoice: async (solicitud, respuesta) => {
    try {
      const Delete = await invoiceModel.findOneAndDelete(solicitud.params.id);
      if (Delete._id) {
        respuesta.json({
          resultado: "bien",
          mensaje: "la factura fue eliminada",
          dato: null,
        });
      }
    } catch (error) {
      respuesta.json({
        resultado: "mal",
        mensaje: "Hubo un error",
      });
    }
  },
};

export default Invoice_controller;
