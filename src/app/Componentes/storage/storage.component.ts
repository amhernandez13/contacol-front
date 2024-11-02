import { Component, inject, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { CommonModule, DatePipe } from '@angular/common';
import { HederComponent } from '../header/heder.component';
import { FooterComponent } from '../footer/footer.component';
import { InvoicesFormComponent } from '../invoices-form/invoices-form.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-storage',
  standalone: true,
  imports: [
    DatePipe,
    HederComponent,
    FooterComponent,
    CommonModule,
    InvoicesFormComponent,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './storage.component.html',
  styleUrls: ['./storage.component.css'],
})
export class StorageComponent implements OnInit {
  storage = inject(StorageService);
  alls: any[] = []; // Lista completa de comprobantes
  filteredAlls: any[] = []; // Lista filtrada de comprobantes
  searchTerm: string = '';
  startDate: string | null = null;
  endDate: string | null = null;
  isLoading = false;
  private router = inject(Router);

  ngOnInit() {
    this.getstorage();
  }

  getstorage() {
    this.isLoading = true;
    this.storage.getStorage().subscribe(
      (answer: any) => {
        if (answer) {
          this.alls = answer;
          this.filteredAlls = this.alls; // Inicialmente, mostrar todos los comprobantes
        } else {
        }
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
      }
    );
  }

  // Método de filtrado de comprobantes
  filterInvoices() {
    const searchTermLower = this.searchTerm.toLowerCase().trim();
    const start = this.startDate ? new Date(this.startDate) : null;
    const end = this.endDate ? new Date(this.endDate) : null;

    this.filteredAlls = this.alls.filter((element) => {
      const matchesSearch = element.invoiceName
        ?.toLowerCase()
        .includes(searchTermLower);
      const uploadDate = new Date(element.uploadDate);
      const matchesDate =
        (!start || uploadDate >= start) && (!end || uploadDate <= end);

      return matchesSearch && matchesDate;
    });
  }

  reloadPage(): void {
    this.router.navigate(['/home']);
  }
}
