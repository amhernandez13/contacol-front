import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  private http = inject(HttpClient);
  API_URL = 'http://localhost:3000/pdf'; // Ruta que maneja la subida de PDFs

  constructor() {}

  uploadPdf(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('invoiceFile', file); // 'invoiceFile' es el nombre que espera Multer
    return this.http.post(`${this.API_URL}/upload-pdf`, formData); // Ruta para subir el PDF
  }
}
