import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InvoiceService } from '../../services/invoice.service';
import { PdfService } from '../../services/pdf-service.service'; // Importamos el nuevo servicio para manejar PDFs

@Component({
  selector: 'app-invoices-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './invoices-form.component.html',
  styleUrl: './invoices-form.component.css',
})
export class InvoicesFormComponent {
  invoiceForm: FormGroup;

  constructor(
    private invoiceService: InvoiceService,
    private pdfService: PdfService // Inyectamos el servicio de PDFs
  ) {
    this.invoiceForm = new FormGroup({
      issue_date: new FormControl(''),
      invoice_type: new FormControl(''),
      payment_method: new FormControl(''),
      invoice: new FormControl(''),
      third_party: new FormControl(''),
      invoice_status: new FormControl(''),
      due_date: new FormControl(''),
      description: new FormControl(''),
      payment_way: new FormControl(''),
      paid_value: new FormControl(''),
      payment_date: new FormControl(''),
      invoice_total: new FormControl(''),
      taxes_total: new FormControl(''),
      rte_fuente: new FormControl(''),
      rte_iva: new FormControl(''),
      rte_ica: new FormControl(''),
      observation: new FormControl(''),
      department: new FormControl(''),
      city: new FormControl(''),
    });
  }

  onSubmit() {
    const formData = this.invoiceForm.value;

    const invoiceData = {
      issue_date: formData.issue_date,
      invoice_type: formData.invoice_type,
      payment_method: formData.payment_method,
      invoice: formData.invoice,
      third_party: formData.third_party,
      invoice_status: formData.invoice_status,
      due_date: formData.due_date,
      description: formData.description,
      payment_way: formData.payment_way,
      paid_value: parseFloat(formData.paid_value),
      payment_date: formData.payment_date,
      payment: {
        taxes_total: parseFloat(formData.taxes_total),
        invoice_total: parseFloat(formData.invoice_total),
        rte_fuente: parseFloat(formData.rte_fuente),
        rte_iva: parseFloat(formData.rte_iva),
        rte_ica: parseFloat(formData.rte_ica),
      },
      observation: formData.observation,
      department: formData.department,
      city: formData.city,
    };

    this.invoiceService.createInvoice(invoiceData).subscribe({
      next: (response) => {
        console.log('Factura creada exitosamente', response);
      },
      error: (error) => {
        console.error('Error al crear la factura:', error);
      },
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.pdfService.uploadPdf(file).subscribe({
        next: (response) => {
          console.log('Datos extraídos del PDF:', response);

          const pdfData = response.data;

          // Función para convertir 'DD-MM-AAAA' a 'YYYY-MM-DD'
          const convertColombianDateToISO = (colombianDate: string | null) => {
            if (!colombianDate || colombianDate === 'No encontrado')
              return null;

            // Separar la fecha colombiana 'DD-MM-AAAA'
            const [day, month, year] = colombianDate.split('-');

            // Retornar en formato 'YYYY-MM-DD' para el input date
            return `${year}-${month}-${day}`;
          };

          // Convertir fechas del formato colombiano 'DD-MM-AAAA' al formato 'YYYY-MM-DD'
          const issueDate = convertColombianDateToISO(pdfData.issue_date);
          const dueDate = convertColombianDateToISO(pdfData.due_date);

          console.log('Issue Date:', issueDate);
          console.log('Due Date:', dueDate);

          // Actualizamos los campos del formulario con los datos extraídos y las fechas convertidas
          this.invoiceForm.patchValue({
            issue_date: issueDate, // Fecha de emisión convertida
            due_date: dueDate, // Fecha de vencimiento convertida
            invoice: pdfData.invoice,
            third_party: pdfData.third_party,
            department: pdfData.department,
            city: pdfData.city,
            taxes_total:
              pdfData.taxes_total?.replace('.', '').replace(',', '.') || '',
            invoice_total:
              pdfData.invoice_total?.replace('.', '').replace(',', '.') || '',
            rte_fuente:
              pdfData.rte_fuente?.replace('.', '').replace(',', '.') || '',
            rte_iva: pdfData.rte_iva?.replace('.', '').replace(',', '.') || '',
            rte_ica: pdfData.rte_ica?.replace('.', '').replace(',', '.') || '',
          });
        },
        error: (error) => {
          console.error('Error al cargar el PDF:', error);
        },
      });
    }
  }
}
