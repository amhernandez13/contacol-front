import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-header-superadmin',
  standalone: true,
  imports: [],
  templateUrl: './header-superadmin.component.html',
  styleUrl: './header-superadmin.component.css',
})
export class HeaderSuperadminComponent {
  constructor(private router: Router, private loginService: LoginService) {}
  // Redirigir al home cuando se hace clic en la imagen
  navigateHome() {
    this.router.navigateByUrl('/user-list');
  }

  // Función para cerrar sesión
  logout() {
    this.loginService.logout();
  }
}
