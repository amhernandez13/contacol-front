import fs from "fs";
import { parse, format } from "date-fns"; // Importamos format para formatear las fechas

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
        issue_date: null, // Fecha de Emisión
        due_date: null, // Fecha de Vencimiento
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

      // Función para construir una fecha manualmente a partir del formato colombiano (dd/MM/yyyy)
      const buildDateFromParts = (dateStr) => {
        const [day, month, year] = dateStr.split(/[\/-]/).map(Number); // Divide la fecha en partes
        if (day && month && year) {
          // Asegurarse de que no sea una fecha inválida
          return new Date(year, month - 1, day); // month - 1 porque los meses en JavaScript son base 0
        }
        return null; // Si no se puede convertir, devolver null
      };

      // Buscar la Fecha de Emisión y convertirla al formato correcto
      const fechaEmisionRegex = /Fecha\s*de\s*Emisión:\s*([\d\/-]+)/i;
      const issueDateMatch = text.match(fechaEmisionRegex);
      if (issueDateMatch) {
        const issueDateStr = issueDateMatch[1].trim(); // Limpiar espacios
        const issueDate = buildDateFromParts(issueDateStr); // Usar la función manual
        if (issueDate) {
          resultJson.issue_date = format(issueDate, "dd-MM-yyyy"); // Formatear la fecha al formato requerido
        } else {
          resultJson.issue_date = "Fecha inválida";
        }
      } else {
        resultJson.issue_date = null; // Si no se encuentra la fecha
      }

      // Buscar la Fecha de Vencimiento y convertirla al formato correcto
      const fechaVencimientoRegex = /Fecha\s*de\s*Vencimiento:\s*([\d\/-]+)/i;
      const dueDateMatch = text.match(fechaVencimientoRegex);
      if (dueDateMatch) {
        const dueDateStr = dueDateMatch[1].trim(); // Limpiar espacios
        const dueDate = buildDateFromParts(dueDateStr); // Usar la función manual
        if (dueDate) {
          resultJson.due_date = format(dueDate, "dd-MM-yyyy"); // Formatear la fecha al formato requerido
        } else {
          resultJson.due_date = "Fecha inválida";
        }
      } else {
        resultJson.due_date = null; // Si no se encuentra la fecha
      }

      // Buscar el Número de Factura (capturamos inicialmente todo)
      const numeroFacturaRegex = /Número\s*de\s*Factura:\s*([A-Za-z0-9\- ]+)/i;
      const numeroFacturaMatch = text.match(numeroFacturaRegex);

      if (numeroFacturaMatch) {
        // Capturar inicialmente el número de factura
        let numeroFactura = numeroFacturaMatch[1].trim();

        // Limpiar manualmente la palabra "Forma" si aparece
        numeroFactura = numeroFactura.replace(/Forma.*$/, "").trim();

        // Guardar el resultado limpio en el JSON
        resultJson.invoice = numeroFactura;
      } else {
        resultJson.invoice = "No encontrado";
      }

      // Continuar con la extracción de los otros datos
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

      // Imprimir en consola el objeto que se enviará al front
      console.log("JSON enviado al front:", resultJson);

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
