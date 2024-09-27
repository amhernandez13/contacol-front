import invoiceModel from "../models/invoiceModel.js";

const Invoice_controller = {
  create_invoice: async (solicitud, respuesta) => {
    try {
      const Emission = solicitud.body.Emission;
      const date = solicitud.body.date;
      const Type_of_invoice = solicitud.body.Type_of_invoice;
      const Payment_method = solicitud.body.Payment_method;
      const Invoice = solicitud.body.Invoice;
      const Thirth_person = solicitud.body.Thirth_person;
      const Invoice_status = solicitud.body.Invoice_status;
      const date2 = solicitud.body.date2;
      const Description = solicitud.body.Description;
      const Payment_method2 = solicitud.body.Payment_method2;
      const Paid_value = solicitud.body.Paid_value;
      const Paid2 = solicitud.body.Paid2;
      const date4 = solicitud.body.date4;
      const T_taxes = solicitud.body.T_taxes;
      const T_Invoice = solicitud.body.T_Invoice;
      const Rte_Fount = solicitud.body.Rte_Fount;
      const Rte_IVA = solicitud.body.Rte_IVA;
      const Rte_ICA = solicitud.body.Rte_ICA;
      const Observation = solicitud.body.Observation;
      const Department = solicitud.body.Department;
      const MunicipioCity = solicitud.body.MunicipioCity;

      const newInvoice = new invoiceModel({
        Emission,
        date,
        Type_of_invoice,
        Payment_method,
        Invoice,
        Thirth_person,
        Invoice_status,
        date2,
        Description,
        Payment_method2,
        Paid_value,
        Paid2,
        date4,
        T_taxes,
        T_Invoice,
        Rte_Fount,
        Rte_IVA,
        Rte_ICA,
        Observation,
        Department,
        MunicipioCity,
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
