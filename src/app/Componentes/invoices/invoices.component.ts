import { Component, inject } from '@angular/core';
import { InvoiceService } from '../../services/invoice.service';
import { CommonModule, DatePipe } from '@angular/common';
import { HederComponent } from '../header/heder.component';
import { FooterComponent } from '../footer/footer.component';
import { InvoicesFormComponent } from '../invoices-form/invoices-form.component';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

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
    RouterLink,
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
  startDate: string | null = null;
  endDate: string | null = null;
  isLoading = false; // Controla la visibilidad del loader

  // Obtener todas las facturas
  getallinvoices() {
    this.isLoading = true; // Mostrar el loader
    this.invoice_service.getInvoices().subscribe(
      (answer: any) => {
        this.alldata = (answer.data || []).sort((a: any, b: any) => {
          return (
            new Date(a.issue_date).getTime() - new Date(b.issue_date).getTime()
          );
        });
        this.filteredData = this.alldata;
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false; // oculta loader si error
      }
    );
  }

  // Método para filtrar las facturas
  filterInvoices() {
    this.isLoading = true; // Mostrar el loader antes de filtrar
    setTimeout(() => {
      const query = this.searchQuery.toLowerCase();

      this.filteredData = this.alldata.filter((invoice) => {
        const matchesQuery =
          invoice.invoice.toLowerCase().includes(query) ||
          invoice.third_party.toLowerCase().includes(query) ||
          invoice.invoice_type.toLowerCase().includes(query);

        const invoiceDate = new Date(invoice.issue_date);

        const matchesDate =
          (!this.startDate || invoiceDate >= new Date(this.startDate)) &&
          (!this.endDate || invoiceDate <= new Date(this.endDate));

        return matchesQuery && matchesDate;
      });

      this.isLoading = false;
    }, 500);
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
    this.getallinvoices(); // Cargamos todas las facturas al inicio
  }

  // Método para recargar la página
  reloadPage(): void {
    window.location.reload();
  }
}
