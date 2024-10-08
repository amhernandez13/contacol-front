import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private http = inject(HttpClient);

  constructor() {}

  getStorage() {
    return this.http.get('http://localhost:3000/storage');
  }

  getStorageById(id: String) {
    return this.http.get('http://localhost:3000/storage/' + id);
  }
}
