import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private http = inject(HttpClient);

  constructor() {}

  API_URL = 'http://localhost:3000/invoice/'; // URL a donde se harán las peticiones (de crear producto)

  createInvoice(
    issue_date: any,
    invoice_type: any,
    payment_method: any,
    invoice: any,
    thirth_party: any,
    invoice_status: any,
    due_date: any,
    description: any,
    payment_way: any,
    paid_value: any,
    payment_date: any,
    payment: {
      taxes_total: any;
      invoice_total: any;
      rte_fuente: any;
      rte_iva: any;
      rte_ica: any;
    },
    observation: any,
    department: any,
    city: any
  ) {
    const formData = new FormData();
    formData.append('issue_date', issue_date);
    formData.append('invoice_type', invoice_type);
    formData.append('payment_method', payment_method);
    formData.append('invoice', invoice);
    formData.append('thirth_party', thirth_party);
    formData.append('invoice_status', invoice_status);
    formData.append('due_date', due_date);
    formData.append('description', description);
    formData.append('payment_way', payment_way);
    formData.append('paid_value', paid_value);
    formData.append('payment_date', payment_date);
    formData.append('taxes_total', payment.taxes_total);
    formData.append('invoice_total', payment.invoice_total);
    formData.append('rte_fuente', payment.rte_fuente);
    formData.append('rte_iva', payment.rte_iva);
    formData.append('rte_ica', payment.rte_ica);
    formData.append('observation', observation);
    formData.append('department', department);
    formData.append('city', city);
    return this.http.post(this.API_URL, formData);
  }

  getInvoices() {
    return this.http.get(this.API_URL);
  }

  getInvoicesById(id: String) {
    return this.http.get(this.API_URL + '/' + id);
  }

  /* putInvoicesById(id: string, data: {}) {
    let promise = new Promise((resolve, reject) => {
      this.http
        .put(id, data)
        .toPromise()
        .then((res: any) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
    return promise;
  } */
}
