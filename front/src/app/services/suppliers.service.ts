import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';


@Injectable({
  providedIn: 'root',
})

export class SuppliersService {

  httpClient = inject(HttpClient);

  private readonly URL_PRODUCT = "http://localhost:3000/Supplier"

  constructor() { }

  createSupplier(supplierData: any) {
    return this.httpClient.post(this.URL_PRODUCT, supplierData);
  }

  getSupplier() {
    return this.httpClient.get(this.URL_PRODUCT);
  }

  deleteSupplierById(id: string) {
    return this.httpClient.delete(`${this.URL_PRODUCT}/${id}`);
  }
}

  


  

