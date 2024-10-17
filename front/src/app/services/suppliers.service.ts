import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SuppliersService {
  private http = inject(HttpClient);

  constructor() {}

  API_URL = 'http://localhost:3000/suppliers'; // URL a donde se harán las peticiones (de crear producto)

  createSupplier(
    thirdParty: any,
    nit: any,
    department: any,
    city: any,
    email: any,
    phone: any
  ) {
    const formData = new FormData();
    formData.append('thirdParty', thirdParty);
    formData.append('nit', nit);
    formData.append('department', department);
    formData.append('city', city);
    formData.append('email', email);
    formData.append('phone', phone);
    return this.http.post(this.API_URL, formData);
  }

  getSuppliers() {
    return this.http.get(this.API_URL);
  }

  deleteSupplierById(id: String) {
    return this.http.delete(this.API_URL + '/' + id);
  }
}
