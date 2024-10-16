import { Component, inject } from '@angular/core';
import { InvoiceService } from '../../services/invoice.service';
import { CommonModule, DatePipe } from '@angular/common';
import { HederComponent } from '../header/heder.component';
import { FooterComponent } from '../footer/footer.component';
import { InvoicesFormComponent } from '../invoices-form/invoices-form.component'; // Asegúrate de importar el componente del formulario
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
  ], // Añadir el componente aquí
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.css',
})
export class InvoicesComponent {
  invoice_service = inject(InvoiceService);
  alldata: any[] = [];
  showForm = false; // Variable para controlar la visibilidad del formulario
  filteredData: any[] = []; // Lista filtrada de facturas
  searchQuery: string = ''; // Para manejar el valor de la búsqueda
  selectedInvoice: any = null;

  // Lógica para obtener las facturas
  getallinvoices() {
    this.invoice_service.getInvoices().subscribe((answer: any) => {
      this.alldata = answer.data || [];
      this.filteredData = this.alldata; // Inicialmente, la lista filtrada es igual a la lista completa
    });
  }

  // Método para manejar la búsqueda
  filterInvoices() {
    const query = this.searchQuery.toLowerCase(); // Convertimos la búsqueda a minúsculas para búsqueda insensible a mayúsculas/minúsculas
    this.filteredData = this.alldata.filter((invoice) => {
      return (
        invoice.invoice.toLowerCase().includes(query) || // Filtrar por número de factura
        invoice.third_party.toLowerCase().includes(query) || // Filtrar por tercero
        invoice.invoice_type.toLowerCase().includes(query) // Filtrar por tipo de factura
      );
    });
  }

  // Este método se llama cuando el formulario debe ser cerrado
  handleFormClosed() {
    this.showForm = false; // Ocultamos el formulario
    this.selectedInvoice = null; // Reseteamos la factura seleccionada
    this.getallinvoices(); // Refrescamos la lista de facturas
  }

  // Método para alternar la visibilidad del formulario
  toggleForm() {
    this.showForm = !this.showForm;
  }

  // Mostrar el formulario con un invoice seleccionado
  openForm(invoice: any = null) {
    this.selectedInvoice = invoice; // Guardamos el invoice que queremos editar o null si es nuevo
    this.showForm = true; // Mostramos el formulario
  }

  ngOnInit() {
    this.getallinvoices();
  }
}
