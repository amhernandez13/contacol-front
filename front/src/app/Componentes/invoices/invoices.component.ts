import { Component, inject } from '@angular/core';
import { InvoiceService } from '../../services/invoice.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.css',
})
export class InvoicesComponent {
  invoice_service = inject(InvoiceService);
  alldata: any[] = [];

  getallinvoices() {
    this.invoice_service.getInvoices().subscribe((answer: any) => {
      console.log('ans: ', answer);
      if (answer.data) {
        this.alldata = answer.data;
        console.log('invoices read correctly');
      } else {
        console.log('an error has ocurred while reading invoices');
      }
      this.alldata = answer.data;
    });
  }
  ngOnInit() {
    this.getallinvoices();
  }
}
