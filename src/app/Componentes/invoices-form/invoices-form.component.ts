import {
  Component,
  Output,
  EventEmitter,
  Input,
  SimpleChanges,
  OnChanges,
  inject,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { InvoiceService } from '../../services/invoice.service';
import { PdfService } from '../../services/pdf-service.service';
import { StorageService } from '../../services/storage.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { SuppliersService } from '../../services/suppliers.service'; // Importamos el servicio de proveedores
import { SupplierModel } from '../../interfaces/supplier-model'; // Importamos el modelo de proveedores

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
  fileUrl: string | null = null;
  isLoading: boolean = false; // Indicador de carga general para el formulario
  isUploadingComprobante: boolean = false; // Indicador de carga para comprobante
  isUploadingInvoice: boolean = false; // Indicador de carga para factura
  @Input() invoice: any = null; // Recibimos la factura si es para editar
  @Output() formClosed = new EventEmitter<void>(); // Emitimos un evento para cerrar el formulario
  toastrService = inject(ToastrService);
  suppliers: SupplierModel[] = []; // Lista de proveedores obtenidos de la base de datos

  constructor(
    private invoiceService: InvoiceService,
    private pdfService: PdfService,
    private storageService: StorageService,
    private suppliersService: SuppliersService
  ) {
    // Ajuste en las validaciones: Solo los campos obligatorios tendrán Validators.required
    this.invoiceForm = new FormGroup({
      issue_date: new FormControl('', [Validators.required]),
      invoice_type: new FormControl('', [Validators.required]),
      payment_method: new FormControl('', [Validators.required]),
      invoice: new FormControl('', [Validators.required]),
      third_party: new FormControl('', [Validators.required]),
      invoice_status: new FormControl('', [Validators.required]),
      due_date: new FormControl(''), // Opcional
      description: new FormControl(''), // Opcional
      payment_way: new FormControl('', [Validators.required]),
      paid_value: new FormControl(''), // Opcional
      payment_date: new FormControl(''), // Opcional
      invoice_total: new FormControl('', [Validators.required]),
      taxes_total: new FormControl(''), // Opcional
      rte_fuente: new FormControl(''), // Opcional
      rte_iva: new FormControl(''), // Opcional
      rte_ica: new FormControl(''), // Opcional
      observation: new FormControl(''), // Opcional
      department: new FormControl(''), // Opcional
      city: new FormControl(''), // Opcional
      supplier: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.suppliersService.getSuppliers().subscribe({
      next: (suppliers: SupplierModel[]) => {
        this.suppliers = suppliers; // Guardamos los proveedores en la variable suppliers
      },
      error: (error) => {
        this.toastrService.error('Error al cargar los proveedores');
        console.error('Error al cargar los proveedores:', error);
      },
    });
  }

  // Detectar los cambios en @Input (factura) y rellenar el formulario
  ngOnChanges(changes: SimpleChanges) {
    if (changes['invoice'] && this.invoice) {
      console.log('Factura recibida para edición:', this.invoice);
      this.patchFormWithInvoiceData(this.invoice);
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
      due_date: invoice.due_date || '', // Opcional
      description: invoice.description || '', // Opcional
      payment_way: invoice.payment_way || '',
      paid_value: invoice.paid_value || '', // Opcional
      payment_date: invoice.payment_date || '', // Opcional
      invoice_total: invoice.payment?.invoice_total || 0,
      taxes_total: invoice.payment?.taxes_total || '', // Opcional
      rte_fuente: invoice.payment?.rte_fuente || 0, // Opcional
      rte_iva: invoice.payment?.rte_iva || 0, // Opcional
      rte_ica: invoice.payment?.rte_ica || 0, // Opcional
      observation: invoice.observation || '', // Opcional
      department: invoice.department || '', // Opcional
      city: invoice.city || '', // Opcional
      supplier: invoice.supplier || '',
    });

    console.log(
      'Formulario rellenado con los datos de la factura:',
      this.invoiceForm.value
    );
  }

  // Método para manejar el envío del formulario
  onSubmit() {
    this.isLoading = true; // Mostrar spinner mientras se procesa la solicitud

    if (this.invoiceForm.invalid) {
      this.toastrService.warning(
        'El formulario contiene errores o está incompleto.'
      );
      this.isLoading = false; // Ocultar spinner si hay error
      return;
    }

    const formData = this.invoiceForm.value;

    // Obtener el ID del proveedor seleccionado y añadirlo al envío
    const selectedSupplier = this.suppliers.find(
      (supplier) => supplier._id === formData.supplier
    );
    if (selectedSupplier) {
      formData.supplier = selectedSupplier._id; // Guardamos el ID del proveedor
    } else {
      this.toastrService.error('Proveedor no válido seleccionado.');
      this.isLoading = false;
      return;
    }

    const invoiceData = {
      ...formData,
      payment: {
        invoice_total: parseFloat(formData.invoice_total),
        taxes_total: parseFloat(formData.taxes_total),
        rte_fuente: parseFloat(formData.rte_fuente),
        rte_iva: parseFloat(formData.rte_iva),
        rte_ica: parseFloat(formData.rte_ica),
      },
    };

    // Subir archivo de comprobante si existe
    if (this.selectedComprobanteFile) {
      this.isUploadingComprobante = true; // Mostrar spinner de comprobante
      this.storageService.uploadFile(this.selectedComprobanteFile).subscribe({
        next: (response) => {
          console.log('Comprobante subido exitosamente:', response);
          invoiceData.url = response.url;
          this.processInvoiceSubmission(invoiceData); // Llamar al método para enviar el JSON con la URL del archivo
        },
        error: (error) => {
          this.toastrService.error('Error al subir el comprobante.');
          console.error('Error al subir el comprobante:', error);
          this.isUploadingComprobante = false; // Ocultar spinner de comprobante si hay error
        },
        complete: () => {
          this.isUploadingComprobante = false; // Ocultar spinner de comprobante al terminar
        },
      });
    } else if (this.selectedInvoiceFile) {
      // Subir archivo de factura si existe
      this.isUploadingInvoice = true; // Mostrar spinner de factura
      this.storageService.uploadFile(this.selectedInvoiceFile).subscribe({
        next: (response) => {
          console.log('Factura subida exitosamente:', response);
          invoiceData.url = response.url;
          this.processInvoiceSubmission(invoiceData); // Llamar al método para enviar el JSON con la URL del archivo
        },
        error: (error) => {
          this.toastrService.error('Error al subir la factura.');
          console.error('Error al subir la factura:', error);
          this.isUploadingInvoice = false; // Ocultar spinner de factura si hay error
        },
        complete: () => {
          this.isUploadingInvoice = false; // Ocultar spinner de factura al terminar
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
        this.toastrService.error(
          'Error: No se pudo identificar la factura para actualizar.'
        );
        this.isLoading = false; // Ocultar spinner al terminar
        return;
      }

      this.invoiceService.updateInvoice(invoiceData, invoiceId).subscribe({
        next: (response) => {
          if (response.result === 'error') {
            console.error('Error al actualizar la factura:', response.message);
            this.toastrService.error(
              'Error al actualizar la factura: ' + response.message
            );
          } else {
            this.toastrService.success('Factura actualizada exitosamente.');
            console.log('Factura actualizada exitosamente', response);
            this.formClosed.emit();
          }
        },
        error: (error) => {
          this.toastrService.error('Error al actualizar la factura.');
          console.error('Error al actualizar la factura:', error);
        },
        complete: () => {
          this.isLoading = false; // Ocultar spinner al terminar
        },
      });
    } else {
      // Si es una nueva factura, hacemos un POST
      console.log('Enviando POST para crear una nueva factura:', invoiceData);

      this.invoiceService.createInvoice(invoiceData).subscribe({
        next: (response) => {
          if (response.result === 'error') {
            console.error('Error al crear la factura:', response.message);
            this.toastrService.error(
              'Error al crear la factura: ' + response.message
            );
          } else {
            this.toastrService.success('Factura creada exitosamente.');
            console.log('Factura creada exitosamente', response);
            this.formClosed.emit();
          }
        },
        error: (error) => {
          this.toastrService.error('Error al crear la factura.');
          console.error('Error al crear la factura:', error);
        },
        complete: () => {
          this.isLoading = false; // Ocultar spinner al terminar
        },
      });
    }
  }

  // Método para manejar la carga de comprobante
  onComprobanteFileSelected(event: any) {
    this.isUploadingComprobante = true; // Mostrar spinner de comprobante
    const file: File = event.target.files[0];
    if (file) {
      this.selectedComprobanteFile = file;
      this.selectedComprobanteFileName = file.name;
      console.log('Comprobante seleccionado:', file);
    }
    this.isUploadingComprobante = false; // Ocultar spinner de comprobante después de la selección
  }

  // Método para manejar la carga de factura
  onFileSelected(event: any) {
    this.isUploadingInvoice = true; // Mostrar spinner de factura
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
        complete: () => {
          this.isUploadingInvoice = false; // Ocultar spinner de factura al terminar
        },
      });
    } else {
      this.isUploadingInvoice = false; // Ocultar spinner de factura después de la selección
    }
  }

  // Método para manejar el cierre del formulario
  closeForm() {
    this.formClosed.emit();
  }
}
