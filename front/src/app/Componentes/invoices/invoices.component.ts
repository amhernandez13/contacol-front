import { Component, inject } from '@angular/core';
import { InvoiceService } from '../../services/invoice.service';
import { CommonModule, DatePipe } from '@angular/common';
import { HederComponent } from '../header/heder.component';
import { FooterComponent } from '../footer/footer.component';
import { InvoicesFormComponent } from '../invoices-form/invoices-form.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [
    DatePipe,
    HederComponent,
    FooterComponent,
    InvoicesFormComponent,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css'],
})
export class InvoicesComponent {
  invoice_service = inject(InvoiceService);
  alldata: any[] = [];
  showForm = false; // Controla la visibilidad del formulario
  filteredData: any[] = []; // Lista filtrada de facturas
  searchQuery: string = ''; // Maneja el valor de la búsqueda
  selectedInvoice: any = null; // Factura seleccionada para editar

  // Obtener todas las facturas
  getallinvoices() {
    this.invoice_service.getInvoices().subscribe((answer: any) => {
      this.alldata = answer.data || [];
      this.filteredData = this.alldata;
    });
  }

  // Método para filtrar las facturas
  filterInvoices() {
    const query = this.searchQuery.toLowerCase();
    this.filteredData = this.alldata.filter((invoice) => {
      return (
        invoice.invoice.toLowerCase().includes(query) ||
        invoice.third_party.toLowerCase().includes(query) ||
        invoice.invoice_type.toLowerCase().includes(query)
      );
    });
  }

  // Método para cerrar el formulario
  handleFormClosed() {
    this.showForm = false;
    this.selectedInvoice = null;
    this.getallinvoices();
  }

  // Alternar la visibilidad del formulario
  toggleForm() {
    this.showForm = !this.showForm;
  }

  // Mostrar el formulario con un invoice seleccionado
  openForm(invoice: any = null) {
    this.selectedInvoice = invoice;
    this.showForm = true;
  }

  ngOnInit() {
    this.getallinvoices();
  }
}
