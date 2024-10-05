import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  API_URL = 'http://localhost:3000/users'; // URL del backend

  constructor(private http: HttpClient) {}

  createUser(userData: any) {
    return this.http.post(this.API_URL, userData); // Enviar los datos como JSON
  }

  getUsers() {
    return this.http.get(this.API_URL);
  }

  getUsersById(id: string) {
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
