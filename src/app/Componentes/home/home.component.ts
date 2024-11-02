import { Component } from '@angular/core';
import { HederComponent } from '../header/heder.component';
import { FooterComponent } from '../footer/footer.component';
import { Router } from '@angular/router';
import { InvoicesComponent } from '../invoices/invoices.component';
import { SuppliersComponent } from '../suppliers/suppliers.component';
import { CommonModule } from '@angular/common';
import { InvoiceService } from '../../services/invoice.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HederComponent,
    FooterComponent,
    InvoicesComponent,
    SuppliersComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  currentComponent: string = 'table'; // Para mostrar la tabla por defecto
  invoices: any[] = []; // Array para almacenar las facturas
  isLoading = false;

  constructor(private invoiceService: InvoiceService, private router: Router) {}

  ngOnInit(): void {
    this.isLoading = true;

    this.invoiceService.getInvoices().subscribe(
      (response) => {
        // Accedemos al array de facturas y lo filtramos
        if (response.data && Array.isArray(response.data)) {
          this.invoices = response.data
            .filter(
              (invoice: any) =>
                (invoice.invoice_status === 'Por pagar / verificado' ||
                  invoice.invoice_status === 'Pendiente verificar') &&
                invoice.due_date
            )
            .sort((a: any, b: any) => {
              // Ordenar por fecha de emisión (due_date) en sentido descendente
              return (
                new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
              );
            });
        } else {
        }

        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
      }
    );
  }

  // Método para mostrar el componente seleccionado
  showComponent(component: string) {
    this.currentComponent = component;
  }

  // Redirección a la ruta del storage
  redirectToWarehouse() {
    this.router.navigate(['/storage']);
  }
}
