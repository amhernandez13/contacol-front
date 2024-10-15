import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InvoiceService } from '../../services/invoice.service';
import { PdfService } from '../../services/pdf-service.service';
import { StorageService } from '../../services/storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-invoices-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './invoices-form.component.html',
  styleUrl: './invoices-form.component.css',
})
export class InvoicesFormComponent {
  invoiceForm: FormGroup;
  selectedInvoiceFileName: string | null = null;
  selectedComprobanteFileName: string | null = null;
  selectedComprobanteFile: File | null = null;
  selectedInvoiceFile: File | null = null;
  facturaUrl: string | null = null; // Variable para almacenar la URL de Cloudinary para la factura

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
    });
  }

  // Método para manejar el envío del formulario
  onSubmit() {
    const formData = this.invoiceForm.value;

    const invoiceData: {
      issue_date: any;
      invoice_type: any;
      payment_method: any;
      invoice: any;
      third_party: any;
      invoice_status: any;
      due_date: any;
      description: any;
      payment_way: any;
      paid_value: number;
      payment_date: any;
      payment: {
        taxes_total: number;
        invoice_total: number;
        rte_fuente: number;
        rte_iva: number;
        rte_ica: number;
      };
      observation: any;
      department: any;
      city: any;
      comprobante_url?: string;
      factura_url?: string; // Agregamos el campo para la URL de la factura
    } = {
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

    // Verificamos si hay un archivo de comprobante seleccionado
    if (this.selectedComprobanteFile) {
      this.storageService.uploadFile(this.selectedComprobanteFile).subscribe({
        next: (response) => {
          console.log('Comprobante subido exitosamente:', response);
          invoiceData.comprobante_url = response.url;
          this.sendInvoice(invoiceData); // Enviamos los datos de la factura con la URL del comprobante
        },
        error: (error) => {
          console.error('Error al subir el comprobante:', error);
        },
      });
    } else if (this.selectedInvoiceFile) {
      // Si hay un archivo de factura seleccionado, subimos el PDF de la factura
      this.storageService.uploadFile(this.selectedInvoiceFile).subscribe({
        next: (response) => {
          console.log('Factura subida exitosamente:', response);
          invoiceData.factura_url = response.url; // Agregamos la URL del archivo en Cloudinary
          this.sendInvoice(invoiceData); // Enviamos los datos de la factura con la URL de la factura
        },
        error: (error) => {
          console.error('Error al subir la factura:', error);
        },
      });
    } else {
      this.sendInvoice(invoiceData);
    }
  }

  sendInvoice(invoiceData: any) {
    this.invoiceService.createInvoice(invoiceData).subscribe({
      next: (response) => {
        console.log('Factura creada exitosamente', response);
      },
      error: (error) => {
        console.error('Error al crear la factura:', error);
      },
    });
  }

  // Método para manejar la carga de comprobante
  onComprobanteFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedComprobanteFile = file;
      this.selectedComprobanteFileName = file.name;
      console.log('Comprobante seleccionado:', file);
    }
  }

  // Método para manejar la carga de factura
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedInvoiceFile = file;
      this.selectedInvoiceFileName = file.name;

      // Subimos el archivo al backend y extraemos datos del PDF
      this.pdfService.uploadPdf(file).subscribe({
        next: (response) => {
          console.log('Datos extraídos del PDF:', response);

          const pdfData = response.data;

          const convertColombianDateToISO = (colombianDate: string | null) => {
            if (!colombianDate || colombianDate === 'No encontrado')
              return null;
            const [day, month, year] = colombianDate.split('-');
            return `${year}-${month}-${day}`;
          };

          const parseCurrencyValue = (value: string | null) => {
            if (!value) return '';
            return value.replace(/\./g, '').replace(',', '.');
          };

          const issueDate = convertColombianDateToISO(pdfData.issue_date);
          const dueDate = convertColombianDateToISO(pdfData.due_date);

          this.invoiceForm.patchValue({
            issue_date: issueDate,
            due_date: dueDate,
            invoice: pdfData.invoice,
            third_party: pdfData.third_party,
            department: pdfData.department,
            city: pdfData.city,
            taxes_total: parseCurrencyValue(pdfData.taxes_total),
            invoice_total: parseCurrencyValue(pdfData.invoice_total),
            rte_fuente: parseCurrencyValue(pdfData.rte_fuente),
            rte_iva: parseCurrencyValue(pdfData.rte_iva),
            rte_ica: parseCurrencyValue(pdfData.rte_ica),
          });
        },
        error: (error) => {
          console.error('Error al cargar el PDF:', error);
        },
      });
    }
  }
}
