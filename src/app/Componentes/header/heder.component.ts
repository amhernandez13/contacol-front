import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-heder',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './heder.component.html',
  styleUrls: ['./heder.component.css'],
})
export class HederComponent {
  isLoggedIn: boolean = false;

  constructor(private router: Router, private loginService: LoginService) {
    this.isLoggedIn = this.loginService.isLoged();
  }

  // Redirigir al home cuando se hace clic en la imagen
  navigateHome() {
    this.router.navigateByUrl('/home');
  }

  // Función para cerrar sesión
  logout() {
    this.loginService.logout();
  }
}
