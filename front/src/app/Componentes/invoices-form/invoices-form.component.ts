import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InvoiceService } from '../../services/invoice.service';
import { PdfService } from '../../services/pdf-service.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-invoices-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './invoices-form.component.html',
  styleUrl: './invoices-form.component.css',
})
export class InvoicesFormComponent {
  invoiceForm: FormGroup;
  selectedFile: File | null = null; // Para almacenar el archivo seleccionado

  constructor(
    private invoiceService: InvoiceService,
    private pdfService: PdfService,
    private storageService: StorageService
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
      supplier: new FormControl(''),
    });
  }

  onSubmit() {
    const formData = this.invoiceForm.value;

    if (this.selectedFile) {
      this.storageService.uploadFile(this.selectedFile).subscribe({
        next: (response) => {
          const fileUrl = response.url;

          const invoiceData = {
            ...formData,
            file_url: fileUrl,
            payment: {
              taxes_total: parseFloat(formData.taxes_total),
              invoice_total: parseFloat(formData.invoice_total),
              rte_fuente: parseFloat(formData.rte_fuente),
              rte_iva: parseFloat(formData.rte_iva),
              rte_ica: parseFloat(formData.rte_ica),
            },
          };

          this.invoiceService.createInvoice(invoiceData).subscribe({
            next: (response) => {
              console.log('Factura creada exitosamente', response);
            },
            error: (error) => {
              console.error('Error al crear la factura:', error);
            },
          });
        },
        error: (error) => {
          console.error('Error al subir el archivo:', error);
        },
      });
    } else {
      console.error('Debe cargar un archivo antes de enviar el formulario.');
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.pdfService.uploadPdf(file).subscribe({
        next: (response) => {
          console.log('Datos extraídos del PDF:', response);

          const pdfData = response.data;

          // Función para convertir 'DD-MM-AAAA' a 'YYYY-MM-DD'
          const convertColombianDateToISO = (colombianDate: string | null) => {
            if (!colombianDate || colombianDate === 'No encontrado') {
              return null;
            }

            // Separar la fecha colombiana 'DD-MM-AAAA'
            const [day, month, year] = colombianDate.split('-');

            if (!day || !month || !year) {
              return null;
            }

            // Retornar en formato 'YYYY-MM-DD' para el input date
            return `${year}-${month}-${day}`;
          };

          // Convertimos las fechas del PDF usando la función
          const issueDate = convertColombianDateToISO(pdfData.issue_date);
          const dueDate = convertColombianDateToISO(pdfData.due_date);

          console.log('Issue Date:', issueDate);
          console.log('Due Date:', dueDate);

          // Actualizamos los campos del formulario con los datos extraídos y las fechas convertidas
          this.invoiceForm.patchValue({
            issue_date: issueDate,
            due_date: dueDate,
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
