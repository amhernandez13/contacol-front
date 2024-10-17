import fs from "fs";

// Función para extraer datos de un archivo PDF
async function extractPdfToJson(pdfFilePath) {
  // Verificamos que el archivo exista antes de intentar leerlo
  if (!pdfFilePath || !fs.existsSync(pdfFilePath)) {
    throw new Error("Archivo PDF no encontrado o ruta inválida.");
  }

  // Cargar dinámicamente pdf-parse solo cuando se necesita
  const pdf = await import("pdf-parse");

  let dataBuffer = fs.readFileSync(pdfFilePath);

  const resultJson = {
    issue_date: "",
    due_date: "",
    invoice: "",
    third_party: "",
    department: "",
    city: "",
    taxes_total: "",
    invoice_total: "",
    rte_fuente: "",
    rte_iva: "",
    rte_ica: "",
    description: "Factura generada automáticamente",
    payment_way: "",
  };

  return pdf.default(dataBuffer).then(function (data) {
    const text = data.text;

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
    resultJson.city = text.match(municipioRegex)?.[1].trim() || "No encontrado";

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

    return resultJson;
  });
}

export default extractPdfToJson;
