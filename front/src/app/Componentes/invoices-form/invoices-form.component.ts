import {
  Component,
  Output,
  EventEmitter,
  Input,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
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
  styleUrls: ['./invoices-form.component.css'],
})
export class InvoicesFormComponent implements OnChanges {
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

  // Detectar los cambios en @Input (factura) y rellenar el formulario
  ngOnChanges(changes: SimpleChanges) {
    if (changes['invoice'] && this.invoice) {
      console.log('Factura recibida para edición:', this.invoice);
      this.patchFormWithInvoiceData(this.invoice); // Llenamos el formulario con la factura seleccionada
    }
  }

  // Rellenar el formulario con los datos recibidos
  patchFormWithInvoiceData(invoice: any) {
    if (!invoice) return;

    this.invoiceForm.patchValue({
      issue_date: invoice.issue_date || '',
      invoice_type: invoice.invoice_type || '',
      payment_method: invoice.payment_method || '',
      invoice: invoice.invoice || '',
      third_party: invoice.third_party || '',
      invoice_status: invoice.invoice_status || '',
      due_date: invoice.due_date || '',
      description: invoice.description || '',
      payment_way: invoice.payment_way || '',
      paid_value: invoice.paid_value || '',
      payment_date: invoice.payment_date || '',
      invoice_total: invoice.payment?.invoice_total || 0, // Acceder correctamente a invoice_total
      taxes_total: invoice.payment?.taxes_total || '',
      rte_fuente: invoice.payment?.rte_fuente || 0, // Acceder correctamente a rte_fuente
      rte_iva: invoice.payment?.rte_iva || 0, // Acceder correctamente a rte_iva
      rte_ica: invoice.payment?.rte_ica || 0, // Acceder correctamente a rte_ica
      observation: invoice.observation || '',
      department: invoice.department || '',
      city: invoice.city || '',
      supplier: invoice.supplier || '',
    });

    console.log(
      'Formulario rellenado con los datos de la factura:',
      this.invoiceForm.value
    );
  }

  // Método para manejar el envío del formulario
  // Método para manejar el envío del formulario
  // Método para manejar el envío del formulario
  // Método para manejar el envío del formulario
  onSubmit() {
    // Verificar si el formulario es válido antes de enviar
    if (this.invoiceForm.invalid) {
      console.error('El formulario contiene errores o está incompleto.');
      return; // No enviar si el formulario no es válido
    }

    // Asegurarse de que 'paid_value' y 'invoice_total' se manejen por separado
    const updatedInvoiceData = {
      ...this.invoiceForm.value, // Copia los valores básicos del formulario
      payment: {
        // Reagrupar los valores relacionados con el pago en un objeto 'payment'
        invoice_total: this.invoiceForm.value.invoice_total, // Monto total de la factura
        taxes_total: this.invoiceForm.value.taxes_total,
        rte_fuente: this.invoiceForm.value.rte_fuente,
        rte_iva: this.invoiceForm.value.rte_iva,
        rte_ica: this.invoiceForm.value.rte_ica,
      },
      paid_value: this.invoiceForm.get('paid_value')?.value || 0, // Valor pagado se maneja por separado y validamos su valor
    };

    // Verificar si estamos en modo de edición (actualización)
    if (this.invoice) {
      const updatedInvoice = {
        ...updatedInvoiceData,
        id: this.invoice._id, // Asegurarse de que el ID de la factura esté presente
      };

      console.log('Enviando PUT para actualizar la factura:', updatedInvoice);

      this.invoiceService
        .updateInvoice(updatedInvoice, this.invoice._id)
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
      console.log(
        'Enviando POST para crear una nueva factura:',
        updatedInvoiceData
      );

      this.invoiceService.createInvoice(updatedInvoiceData).subscribe({
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
