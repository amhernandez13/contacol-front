import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private http = inject(HttpClient);

  constructor() {}

  API_URL = 'http://localhost:3000/suppliers'; // URL a donde se harán las peticiones (de crear producto)

  createUser(name: any, email: any, password: any, role: any, state: any) {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('role', role);
    formData.append('state', state);
    return this.http.post(this.API_URL, formData);
  }

  getUsers() {
    return this.http.get(this.API_URL);
  }

  getUsersById(id: String) {
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
