import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserRegisterFormComponent } from '../user-register-form/user-register-form.component';
import { HederComponent } from '../../Componentes/header/heder.component';
import { FooterComponent } from '../../Componentes/footer/footer.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    UserRegisterFormComponent,
    HederComponent,
    FooterComponent,
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  searchTerm: string = '';
  loading: boolean = false;
  error: string | null = null;

  isModalOpen: boolean = false; // Controla la visibilidad del modal
  selectedUser: any = null; // Usuario seleccionado para editar

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.loading = true;
    this.usersService.getUsers().subscribe({
      next: (response: any) => {
        this.users = response.data;
        this.filteredUsers = this.users;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener los usuarios:', err);
        this.error = 'Hubo un problema al cargar los usuarios.';
        this.loading = false;
      },
    });
  }

  // Función para filtrar usuarios con la barra de búsqueda
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
    const updatedUser = { ...user, state: newState }; // Actualiza el estado localmente
    this.usersService.updateUserState(updatedUser).subscribe({
      next: (response) => {
        user.state = newState; // Actualiza visualmente el estado del usuario
      },
      error: (error) => {
        console.error('Error al cambiar el estado del usuario', error);
        alert('Hubo un problema al cambiar el estado del usuario.');
      },
    });
  }

  openModal(): void {
    this.isModalOpen = true;
    this.selectedUser = null;
  }

  openEditModal(user: any): void {
    this.selectedUser = user;
    this.isModalOpen = true; // Abrimos el modal con los datos prellenados
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  onUserRegistered(): void {
    this.closeModal();
    this.fetchUsers();
  }

  onUserEdited(): void {
    this.closeModal();
    this.fetchUsers();
  }
}
