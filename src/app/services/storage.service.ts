import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private http = inject(HttpClient);
  API_URL = 'https://equipo-25.onrender.com/storage';

  constructor() {}

  // Método para obtener el almacenamiento
  getStorage(): Observable<any> {
    return this.http.get('https://equipo-25.onrender.com/storage');
  }

  // Método para obtener un archivo específico por ID
  getStorageById(id: string): Observable<any> {
    return this.http.get('https://equipo-25.onrender.com/storage/' + id);
  }

  // Función para subir el archivo con el nombre original
  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file); // Enviamos el archivo

    // Añadimos el nombre original del archivo
    formData.append('filename', file.name);

    return this.http.post(this.API_URL, formData);
  }
}
