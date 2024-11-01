import { Component, OnInit, inject } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserRegisterFormComponent } from '../user-register-form/user-register-form.component';
import { HederComponent } from '../../Componentes/header/heder.component';
import { FooterComponent } from '../../Componentes/footer/footer.component';
import { ToastrService } from 'ngx-toastr';
import { HeaderSuperadminComponent } from '../../Componentes/header-superadmin/header-superadmin.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    UserRegisterFormComponent,
    HederComponent,
    FooterComponent,
    HeaderSuperadminComponent,
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

  isModalOpen: boolean = false;
  selectedUser: any = null;

  constructor(private usersService: UsersService) {}

  toastrService = inject(ToastrService);

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.loading = true;
    this.usersService.getUsers().subscribe({
      next: (response: any) => {
        // Filtrar usuarios que no sean superAdmin
        this.users = response.data.filter(
          (user: any) => user.role !== 'superAdmin'
        );
        this.filteredUsers = this.users;
        this.loading = false;
      },
      error: (err) => {
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
    const updatedUser = { ...user, state: newState };
    this.usersService.updateUserState(updatedUser).subscribe({
      next: (response) => {
        user.state = newState;
      },
      error: (error) => {
        this.toastrService.error(
          'Hubo un problema al cambiar el estado del usuario.'
        );
      },
    });
  }

  openModal(): void {
    this.isModalOpen = true;
    this.selectedUser = null;
  }

  openEditModal(user: any): void {
    this.selectedUser = user;
    this.isModalOpen = true;
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
