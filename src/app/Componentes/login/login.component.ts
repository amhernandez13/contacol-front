import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginCredentials } from '../../interfaces/login-credentials';
import { LoginService } from '../../services/login.service';
import { FooterComponent } from '../footer/footer.component';
import { HederComponent } from '../header/heder.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, HederComponent, FooterComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  router = inject(Router);
  toastrService = inject(ToastrService);
  loginService: LoginService = inject(LoginService);

  loginCredentialsData = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  handleLoginSubmit() {
    if (this.loginCredentialsData.valid) {
      const email = this.loginCredentialsData.value.email;
      const password = this.loginCredentialsData.value.password;

      if (typeof email === 'string' && typeof password === 'string') {
        const credentials: LoginCredentials = { email, password };

        this.loginService.login(credentials).subscribe(
          (res: any) => {
            if (res.state === 'Successful') {
              localStorage.setItem('token', res.data.token);

              const decodedToken: any = this.loginService.decodeToken(
                res.data.token
              );

              // Verificar el campo "state" del usuario
              if (decodedToken && decodedToken.state) {
                localStorage.setItem('role', decodedToken.role);

                // Redirigir según el rol del usuario
                switch (decodedToken.role) {
                  case 'admin':
                    this.router.navigateByUrl('/home');
                    break;
                  case 'accountant':
                    this.router.navigateByUrl('/storage');
                    break;
                  case 'superAdmin':
                    this.router.navigateByUrl('/user-list');
                    break;
                  default:
                    this.toastrService.error('Rol no válido');
                }
              } else {
                // Si el state es false, no permitir acceso
                this.toastrService.warning(
                  'Su cuenta está deshabilitada. Contacte al administrador.'
                );
              }
            } else {
              this.toastrService.error(res.mesage || 'Credenciales inválidas');
            }
          },
          (error) => {
            this.toastrService.error('Credenciales incorrectas');
          }
        );
      }
    } else {
      this.toastrService.warning('Campos de credenciales vacíos');
    }
  }
}
