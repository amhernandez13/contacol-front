import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private http = inject(HttpClient);
  API_URL = 'http://localhost:3000/storage';

  constructor() {}

  // Método para obtener el almacenamiento (si lo necesitas)
  getStorage(): Observable<any> {
    return this.http.get('http://localhost:3000/storage');
  }

  // Método para obtener un archivo específico por ID (si lo necesitas)
  getStorageById(id: string): Observable<any> {
    return this.http.get('http://localhost:3000/storage/' + id);
  }

  // Función para subir el archivo con el nombre original
  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file); // Enviamos el archivo

    // Log para verificar qué archivo se está enviando
    console.log('Archivo a subir:', file);

    // Añadimos el nombre original del archivo
    formData.append('filename', file.name);

    return this.http.post(this.API_URL, formData);
  }
}
