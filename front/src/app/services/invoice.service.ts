import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private http = inject(HttpClient);
  API_URL = 'http://localhost:3000/invoice';

  constructor() {}

  createInvoice(invoiceData: any): Observable<any> {
    return this.http.post(this.API_URL, invoiceData); // Enviar el JSON directamente
  }

  getInvoices(): Observable<any> {
    return this.http.get(this.API_URL);
  }

  getInvoicesById(id: string): Observable<any> {
    return this.http.get(`${this.API_URL}/${id}`);
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
