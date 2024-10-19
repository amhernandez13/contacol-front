import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SupplierModel } from '../interfaces/supplier-model';

@Injectable({
  providedIn: 'root',
})
export class SuppliersService {
  private readonly API_URL = 'https://equipo-25.onrender.com/suppliers';

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private toastrService: ToastrService
  ) {}

  // Crear un nuevo proveedor
  createSupplier(supplierData: SupplierModel): Observable<SupplierModel> {
    return this.httpClient.post<SupplierModel>(this.API_URL, supplierData).pipe(
      catchError((error) => {
        this.toastrService.error('Error al crear el proveedor');
        return throwError(() => new Error(error));
      })
    );
  }

  // Obtener todos los proveedores
  getSuppliers(): Observable<SupplierModel[]> {
    return this.httpClient.get<SupplierModel[]>(this.API_URL).pipe(
      catchError((error) => {
        this.toastrService.error('Error al obtener los proveedores');
        return throwError(() => new Error(error));
      })
    );
  }

  // Obtener un proveedor por ID
  getSupplierById(id: string): Observable<SupplierModel> {
    return this.httpClient.get<SupplierModel>(`${this.API_URL}/${id}`).pipe(
      catchError((error) => {
        this.toastrService.error('Error al obtener el proveedor');
        return throwError(() => new Error(error));
      })
    );
  }

  // Actualizar un proveedor existente por ID
  updateSupplier(
    id: string,
    supplierData: SupplierModel
  ): Observable<SupplierModel> {
    return this.httpClient
      .put<SupplierModel>(`${this.API_URL}/${id}`, supplierData)
      .pipe(
        catchError((error) => {
          this.toastrService.error('Error al actualizar el proveedor');
          return throwError(() => new Error(error));
        })
      );
  }

  // Eliminar proveedor por ID
  deleteSupplierById(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.API_URL}/${id}`).pipe(
      catchError((error) => {
        this.toastrService.error('Error al eliminar el proveedor');
        return throwError(() => new Error(error));
      })
    );
  }
}
