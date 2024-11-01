import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private http = inject(HttpClient);
  API_URL = 'https://equipo-25.onrender.com/invoice';

  constructor() {}

  // Crear una factura con PDF adjunto
  createInvoiceWithPdf(invoiceData: FormData): Observable<any> {
    return this.http.post(this.API_URL, invoiceData);
  }

  // Crear una factura sin PDF adjunto (solo JSON)
  createInvoice(invoiceData: any): Observable<any> {
    return this.http.post(this.API_URL, invoiceData);
  }

  // Obtener todas las facturas
  getInvoices(): Observable<any> {
    return this.http.get(this.API_URL);
  }

  // Obtener una factura por ID
  getInvoicesById(id: string): Observable<any> {
    return this.http.get(`${this.API_URL}/${id}`);
  }

  // Método para actualizar una factura existente (PUT)
  updateInvoice(invoiceData: any, id: number): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}`, invoiceData);
  }

  // otra opción para actualizar facturas
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
