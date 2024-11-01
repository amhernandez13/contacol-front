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
import { SuppliersService } from '../../services/suppliers.service';
import { SupplierModel } from '../../interfaces/supplier-model';

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
  isLoading: boolean = false;
  isUploadingComprobante: boolean = false;
  isUploadingInvoice: boolean = false;
  @Input() invoice: any = null; // Recibimos la factura si es para editar
  @Output() formClosed = new EventEmitter<void>();
  toastrService = inject(ToastrService);
  suppliers: SupplierModel[] = [];

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
      due_date: new FormControl(''),
      description: new FormControl(''),
      payment_way: new FormControl('', [Validators.required]),
      paid_value: new FormControl(''),
      payment_date: new FormControl(''),
      invoice_total: new FormControl('', [Validators.required]),
      taxes_total: new FormControl(''),
      rte_fuente: new FormControl(''),
      rte_iva: new FormControl(''),
      rte_ica: new FormControl(''),
      observation: new FormControl(''),
      department: new FormControl(''),
      city: new FormControl(''),
      supplier: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.suppliersService.getSuppliers().subscribe({
      next: (suppliers: SupplierModel[]) => {
        this.suppliers = suppliers;
      },
      error: (error) => {
        this.toastrService.error('Error al cargar los proveedores');
      },
    });
  }

  // Detectar los cambios en @Input (factura) y rellenar el formulario
  ngOnChanges(changes: SimpleChanges) {
    if (changes['invoice'] && this.invoice) {
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
      due_date: invoice.due_date || '',
      description: invoice.description || '',
      payment_way: invoice.payment_way || '',
      paid_value: invoice.paid_value || '',
      payment_date: invoice.payment_date || '',
      invoice_total: invoice.payment?.invoice_total || 0,
      taxes_total: invoice.payment?.taxes_total || '',
      rte_fuente: invoice.payment?.rte_fuente || 0,
      rte_iva: invoice.payment?.rte_iva || 0,
      rte_ica: invoice.payment?.rte_ica || 0,
      observation: invoice.observation || '',
      department: invoice.department || '',
      city: invoice.city || '',
      supplier: invoice.supplier || '',
    });
  }

  // Método para manejar el envío del formulario
  onSubmit() {
    this.isLoading = true;

    if (this.invoiceForm.invalid) {
      this.toastrService.warning(
        'El formulario contiene errores o está incompleto.'
      );
      this.isLoading = false;
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
      this.isUploadingComprobante = true;
      this.storageService.uploadFile(this.selectedComprobanteFile).subscribe({
        next: (response) => {
          invoiceData.url = response.url;
          this.processInvoiceSubmission(invoiceData);
        },
        error: (error) => {
          this.toastrService.error('Error al subir el comprobante.');
          this.isUploadingComprobante = false;
        },
        complete: () => {
          this.isUploadingComprobante = false;
        },
      });
    } else if (this.selectedInvoiceFile) {
      // Subir archivo de factura si existe
      this.isUploadingInvoice = true;
      this.storageService.uploadFile(this.selectedInvoiceFile).subscribe({
        next: (response) => {
          invoiceData.url = response.url;
          this.processInvoiceSubmission(invoiceData);
        },
        error: (error) => {
          this.toastrService.error('Error al subir la factura.');
          this.isUploadingInvoice = false;
        },
        complete: () => {
          this.isUploadingInvoice = false;
        },
      });
    } else {
      this.processInvoiceSubmission(invoiceData);
    }
  }

  // Método separado para procesar la creación o actualización de la factura
  processInvoiceSubmission(invoiceData: any) {
    if (this.invoice) {
      // Si estamos editando, hacemos un PUT
      // Verificar que el ID de la factura esté presente y que no sea nulo
      const invoiceId = this.invoice._id || this.invoice.id;
      if (!invoiceId) {
        this.toastrService.error(
          'Error: No se pudo identificar la factura para actualizar.'
        );
        this.isLoading = false;
        return;
      }

      this.invoiceService.updateInvoice(invoiceData, invoiceId).subscribe({
        next: (response) => {
          if (response.result === 'error') {
            this.toastrService.error(
              'Error al actualizar la factura: ' + response.message
            );
          } else {
            this.toastrService.success('Factura actualizada exitosamente.');
            this.formClosed.emit();
          }
        },
        error: (error) => {
          this.toastrService.error('Error al actualizar la factura.');
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    } else {
      // Si es una nueva factura, hacemos un POST
      this.invoiceService.createInvoice(invoiceData).subscribe({
        next: (response) => {
          if (response.result === 'error') {
            this.toastrService.error(
              'Error al crear la factura: ' + response.message
            );
          } else {
            this.toastrService.success('Factura creada exitosamente.');
            this.formClosed.emit();
          }
        },
        error: (error) => {
          this.toastrService.error('Error al crear la factura.');
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    }
  }

  // Método para manejar la carga de comprobante
  onComprobanteFileSelected(event: any) {
    this.isUploadingComprobante = true;
    const file: File = event.target.files[0];
    if (file) {
      this.selectedComprobanteFile = file;
      this.selectedComprobanteFileName = file.name;
    }
    this.isUploadingComprobante = false;
  }

  // Método para manejar la carga de factura
  onFileSelected(event: any) {
    this.isUploadingInvoice = true;
    const file: File = event.target.files[0];
    if (file) {
      this.selectedInvoiceFile = file;
      this.selectedInvoiceFileName = file.name;

      // Subimos el archivo al backend y extraemos datos del PDF
      this.pdfService.uploadPdf(file).subscribe({
        next: (response) => {
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
        error: (error) => {},
        complete: () => {
          this.isUploadingInvoice = false;
        },
      });
    } else {
      this.isUploadingInvoice = false;
    }
  }

  // Método para manejar el cierre del formulario
  closeForm() {
    this.formClosed.emit();
  }
}
