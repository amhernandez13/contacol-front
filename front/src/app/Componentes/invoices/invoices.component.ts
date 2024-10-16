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
      this.filteredData = this.alldata; // La lista filtrada es igual a la lista completa inicialmente
    });
  }

  // Método para filtrar las facturas
  filterInvoices() {
    const query = this.searchQuery.toLowerCase(); // Convertimos a minúsculas para búsqueda insensible a mayúsculas/minúsculas
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
    this.showForm = false; // Oculta el formulario
    this.selectedInvoice = null; // Resetea la factura seleccionada
    this.getallinvoices(); // Refresca la lista de facturas
  }

  // Alternar la visibilidad del formulario
  toggleForm() {
    this.showForm = !this.showForm;
  }

  // Mostrar el formulario con un invoice seleccionado
  openForm(invoice: any = null) {
    this.selectedInvoice = invoice; // Guardamos la factura seleccionada o null si es nueva
    this.showForm = true; // Mostramos el formulario
  }

  ngOnInit() {
    this.getallinvoices(); // Cargamos todas las facturas al inicio
  }
}
