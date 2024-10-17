import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  API_URL = 'http://localhost:3000/users'; // URL del backend

  constructor(private http: HttpClient) {}

  // Método para crear un nuevo usuario
  createUser(userData: any): Observable<any> {
    return this.http.post(this.API_URL, userData); // Enviar los datos como JSON
  }

  // Método para obtener todos los usuarios
  getUsers(): Observable<any> {
    return this.http.get(this.API_URL);
  }

  // Método para actualizar el estado del usuario (activo/inactivo)
  updateUserState(userData: any): Observable<any> {
    return this.http.put(`${this.API_URL}/${userData._id}`, {
      state: userData.state,
    });
  }

  // Método para actualizar un usuario (nombre, email, rol, etc.)
  updateUser(userId: string, updatedUserData: any): Observable<any> {
    return this.http.put(`${this.API_URL}/${userId}`, updatedUserData);
  }

  // Método para obtener un usuario por ID
  getUsersById(id: string): Observable<any> {
    return this.http.get(`${this.API_URL}/${id}`);
  }
}
