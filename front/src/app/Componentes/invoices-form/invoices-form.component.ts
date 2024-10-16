import { Component, Output, EventEmitter, Input } from '@angular/core';
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
  fileUrl: string | null = null; // Variable para almacenar la URL del archivo (factura o comprobante)
  @Input() invoice: any = null; // Recibimos la factura si es para editar
  @Output() formClosed = new EventEmitter<void>(); // Emitimos un evento para cerrar el formulario

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

  ngOnInit() {
    if (this.invoice) {
      // Si recibimos un invoice, rellenamos el formulario con los datos existentes
      this.invoiceForm.patchValue(this.invoice);
    }
  }

  // Método para manejar el envío del formulario
  onSubmit() {
    if (this.invoice) {
      // Si estamos editando, hacemos un PUT
      this.invoiceService
        .updateInvoice(this.invoiceForm.value, this.invoice.id)
        .subscribe({
          next: (response) => {
            console.log('Factura actualizada exitosamente', response);
            this.formClosed.emit(); // Cerramos el formulario al terminar
          },
          error: (error) => {
            console.error('Error al actualizar la factura:', error);
          },
        });
    } else {
      // Si es una nueva factura, hacemos un POST
      this.invoiceService.createInvoice(this.invoiceForm.value).subscribe({
        next: (response) => {
          console.log('Factura creada exitosamente', response);
          this.formClosed.emit(); // Cerramos el formulario al terminar
        },
        error: (error) => {
          console.error('Error al crear la factura:', error);
        },
      });
    }
  }

  // Método para enviar el JSON de la factura al backend
  sendInvoice(invoiceData: any) {
    this.invoiceService.createInvoice(invoiceData).subscribe({
      next: (response) => {
        console.log('Factura creada exitosamente', response);
        console.log(invoiceData);
        // Emitimos el evento cuando el formulario se ha enviado correctamente
        this.formClosed.emit(); // Notificamos que el formulario debe cerrarse
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
  // Método para manejar el cierre del formulario
  closeForm() {
    this.formClosed.emit(); // Emitimos el evento para cerrar el formulario
  }
}
