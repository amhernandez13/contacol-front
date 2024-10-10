import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { CommonModule } from '@angular/common';
import { UserRegisterFormComponent } from '../user-register-form/user-register-form.component';
import { HederComponent } from '../../Componentes/header/heder.component';
import { FooterComponent } from '../../Componentes/footer/footer.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    UserRegisterFormComponent,
    HederComponent,
    FooterComponent,
    FormsModule,
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = []; // Lista filtrada de usuarios
  searchTerm: string = ''; // Término de búsqueda
  loading: boolean = false;
  error: string | null = null;

  isModalOpen: boolean = false; // Aquí se controla la visibilidad del modal

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.loading = true;
    this.usersService.getUsers().subscribe({
      next: (response: any) => {
        this.users = response.data;
        this.filteredUsers = this.users; // Inicialmente, todos los usuarios se muestran
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener los usuarios:', err);
        this.error = 'Hubo un problema al cargar los usuarios.';
        this.loading = false;
      },
    });
  }

  // Filtrar usuarios basado en el término de búsqueda
  filterUsers(): void {
    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTermLower) ||
        user.email.toLowerCase().includes(searchTermLower) ||
        user.role.toLowerCase().includes(searchTermLower)
    );
  }

  // Función para cambiar el estado del usuario (activo/inactivo)
  changeUserState(user: any, newState: boolean): void {
    const updatedUser = { ...user, state: newState }; // Actualizar el estado
    this.usersService.updateUserState(updatedUser).subscribe({
      next: (response) => {
        user.state = newState; // Actualizamos visualmente el estado del usuario
      },
      error: (error) => {
        console.error('Error al cambiar el estado del usuario', error);
        alert('Hubo un problema al cambiar el estado del usuario.');
      },
    });
  }

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  // Una vez se registra el usuario, se cierra el modal y se actualiza la lista
  onUserRegistered(): void {
    this.closeModal();
    this.fetchUsers();
  }
}
