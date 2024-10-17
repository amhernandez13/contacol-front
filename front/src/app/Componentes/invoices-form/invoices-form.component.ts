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
  onSubmit() {
    // Verificar si el formulario es válido antes de enviar
    if (this.invoiceForm.invalid) {
      alert('El formulario contiene errores o está incompleto.');
      console.error('El formulario contiene errores o está incompleto.');
      return; // No enviar si el formulario no es válido
    }

    const formData = this.invoiceForm.value;

    // Reagrupar los valores relacionados con el pago en un objeto 'payment'
    const invoiceData = {
      ...formData, // Copia los valores básicos del formulario
      payment: {
        invoice_total: parseFloat(formData.invoice_total),
        taxes_total: parseFloat(formData.taxes_total),
        rte_fuente: parseFloat(formData.rte_fuente),
        rte_iva: parseFloat(formData.rte_iva),
        rte_ica: parseFloat(formData.rte_ica),
      },
      url: formData.url || '', // Manejar el caso en que `url` esté vacía
    };

    // Subir archivo de comprobante si existe
    if (this.selectedComprobanteFile) {
      this.storageService.uploadFile(this.selectedComprobanteFile).subscribe({
        next: (response) => {
          console.log('Comprobante subido exitosamente:', response);
          invoiceData.url = response.url; // Asignamos la URL del comprobante
          this.processInvoiceSubmission(invoiceData); // Llamar al método para enviar el JSON con la URL del archivo
        },
        error: (error) => {
          alert('Error al subir el comprobante.'); // Alerta en caso de error
          console.error('Error al subir el comprobante:', error);
        },
      });
    } else if (this.selectedInvoiceFile) {
      // Subir archivo de factura si existe
      this.storageService.uploadFile(this.selectedInvoiceFile).subscribe({
        next: (response) => {
          console.log('Factura subida exitosamente:', response);
          invoiceData.url = response.url; // Asignamos la URL de la factura
          this.processInvoiceSubmission(invoiceData); // Llamar al método para enviar el JSON con la URL del archivo
        },
        error: (error) => {
          alert('Error al subir la factura.'); // Alerta en caso de error
          console.error('Error al subir la factura:', error);
        },
      });
    } else {
      this.processInvoiceSubmission(invoiceData); // Si no hay archivo, enviamos solo el formulario
    }
  }

  // Método separado para procesar la creación o actualización de la factura
  processInvoiceSubmission(invoiceData: any) {
    if (this.invoice) {
      // Si estamos editando, hacemos un PUT
      console.log('Enviando PUT para actualizar la factura:', invoiceData);

      // Verificar que el ID de la factura esté presente y que no sea nulo
      const invoiceId = this.invoice._id || this.invoice.id;
      if (!invoiceId) {
        console.error('Error: ID de la factura no encontrado.');
        alert('Error: No se pudo identificar la factura para actualizar.');
        return;
      }

      this.invoiceService.updateInvoice(invoiceData, invoiceId).subscribe({
        next: (response) => {
          if (response.result === 'error') {
            console.error('Error al actualizar la factura:', response.message);
            alert('Error al actualizar la factura: ' + response.message);
          } else {
            alert('Factura actualizada exitosamente.');
            console.log('Factura actualizada exitosamente', response);
            this.formClosed.emit(); // Cerramos el formulario al terminar
          }
        },
        error: (error) => {
          alert('Error al actualizar la factura.'); // Alerta en caso de error
          console.error('Error al actualizar la factura:', error);
        },
      });
    } else {
      // Si es una nueva factura, hacemos un POST
      console.log('Enviando POST para crear una nueva factura:', invoiceData);

      this.invoiceService.createInvoice(invoiceData).subscribe({
        next: (response) => {
          if (response.result === 'error') {
            console.error('Error al crear la factura:', response.message);
            alert('Error al crear la factura: ' + response.message);
          } else {
            alert('Factura creada exitosamente.');
            console.log('Factura creada exitosamente', response);
            this.formClosed.emit(); // Cerramos el formulario al terminar
          }
        },
        error: (error) => {
          alert('Error al crear la factura.'); // Alerta en caso de error
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
