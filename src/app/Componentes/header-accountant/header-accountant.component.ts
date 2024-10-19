import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-header-accountant',
  standalone: true,
  imports: [],
  templateUrl: './header-accountant.component.html',
  styleUrl: './header-accountant.component.css',
})
export class HeaderAccountantComponent {
  constructor(private router: Router, private loginService: LoginService) {}
  // Redirigir al home cuando se hace clic en la imagen
  navigateHome() {
    this.router.navigateByUrl('/storage');
  }

  // Función para cerrar sesión
  logout() {
    this.loginService.logout();
  }
}
