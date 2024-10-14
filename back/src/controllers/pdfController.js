import fs from "fs";

const Pdf_controller = {
  extract_pdf_data: async (req, res) => {
    try {
      // Verificamos que Multer haya guardado al menos un archivo PDF
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          error: true,
          message: "No PDF file provided",
        });
      }

      // Obtener el primer archivo subido (puedes modificar esto si permites varios archivos)
      const pdfFilePath = req.files[0].path;

      // Verifica si el archivo realmente existe
      if (!fs.existsSync(pdfFilePath)) {
        return res.status(400).json({
          error: true,
          message: "PDF file does not exist on the server",
        });
      }

      // Cargar dinámicamente la librería pdf-parse solo cuando sea necesario
      const pdf = await import("pdf-parse");

      // Leer y procesar el PDF
      const dataBuffer = fs.readFileSync(pdfFilePath);
      const extractedData = await pdf.default(dataBuffer);

      // Extraer los datos clave del PDF
      const text = extractedData.text;
      const resultJson = {
        issue_date: "", // Fecha de Emisión
        due_date: "", // Fecha de Vencimiento
        invoice: "", // Número de Factura
        third_party: "", // Razón Social (Tercero)
        department: "", // Departamento
        city: "", // Ciudad
        taxes_total: "", // Total Impuesto
        invoice_total: "", // Total Factura
        rte_fuente: "", // Retención en la Fuente
        rte_iva: "", // Retención de IVA
        rte_ica: "", // Retención ICA
        description: "Factura generada automáticamente", // Descripción
        payment_way: "", // Forma de Pago
      };

      // Usamos expresiones regulares para extraer los datos clave del texto del PDF
      const fechaEmisionRegex = /Fecha\s*de\s*Emisión:\s*([\d\/]+)/i;
      resultJson.issue_date =
        text.match(fechaEmisionRegex)?.[1] || "No encontrado";

      const fechaVencimientoRegex = /Fecha\s*de\s*Vencimiento:\s*([\d\/]+)/i;
      resultJson.due_date =
        text.match(fechaVencimientoRegex)?.[1] || "No encontrado";

      const numeroFacturaRegex = /Número\s*de\s*Factura:\s*([A-Za-z0-9\- ]+)/i;
      resultJson.invoice =
        text.match(numeroFacturaRegex)?.[1].trim() || "No encontrado";

      const razonSocialRegex = /Razón\s*Social:\s*(.+)/i;
      resultJson.third_party =
        text.match(razonSocialRegex)?.[1].trim() || "No encontrado";

      const departamentoRegex = /Departamento:\s*(.+)/i;
      resultJson.department =
        text.match(departamentoRegex)?.[1].trim() || "No encontrado";

      const municipioRegex = /Municipio\s*\/\s*Ciudad:\s*(.+)/i;
      resultJson.city =
        text.match(municipioRegex)?.[1].trim() || "No encontrado";

      const totalImpuestoRegex = /Total\s*impuesto\s*\(=\)\s*\$?\s*([\d\.,]+)/i;
      resultJson.taxes_total =
        text.match(totalImpuestoRegex)?.[1].trim() || "No encontrado";

      const totalFacturaRegex =
        /Total\s*factura\s*\(=\)\s*[^\d]*(COP)?\s*\$?\s*([\d\.,]+)/i;
      resultJson.invoice_total =
        text.match(totalFacturaRegex)?.[2].trim() || "No encontrado";

      const reteFuenteRegex = /Rete\s*fuente\s*\$?\s*([\d\.,]+)/i;
      resultJson.rte_fuente =
        text.match(reteFuenteRegex)?.[1].trim() || "No encontrado";

      const reteIVARegex = /Rete\s*IVA\s*\$?\s*([\d\.,]+)/i;
      resultJson.rte_iva =
        text.match(reteIVARegex)?.[1].trim() || "No encontrado";

      const reteICARegex = /Rete\s*ICA\s*\$?\s*([\d\.,]+)/i;
      resultJson.rte_ica =
        text.match(reteICARegex)?.[1].trim() || "No encontrado";

      const formaPagoRegex = /Forma\s*de\s*Pago:\s*(.+)/i;
      resultJson.payment_way =
        text.match(formaPagoRegex)?.[1].trim() || "No encontrado";

      // Enviar el JSON con los datos extraídos al front-end
      return res.status(200).json({
        result: "Good",
        message: "PDF processed successfully",
        data: resultJson,
      });
    } catch (error) {
      console.error("Error processing PDF:", error);
      return res.status(500).json({
        error: true,
        message: "An error occurred while processing the PDF",
      });
    }
  },
};

export default Pdf_controller;
