import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-register-form',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule],
  templateUrl: './user-register-form.component.html',
  styleUrl: './user-register-form.component.css',
})
export class UserRegisterFormComponent {
  userRegister: FormGroup;

  constructor(private usersService: UsersService) {
    this.userRegister = new FormGroup(
      {
        name: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', Validators.required),
        confirmPassword: new FormControl('', Validators.required),
        role: new FormControl('', Validators.required),
      },
      { validators: this.passwordValidator } // Pasamos el validador
    );
  }

  // Validador personalizado para contraseñas
  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    // Si las contraseñas no coinciden, devolvemos un error
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  // Método para enviar el formulario
  onSubmit() {
    // Verificamos si hay campos faltantes
    if (
      this.userRegister.hasError('required', 'name') ||
      this.userRegister.hasError('required', 'email') ||
      this.userRegister.hasError('required', 'password') ||
      this.userRegister.hasError('required', 'confirmPassword') ||
      this.userRegister.hasError('required', 'role')
    ) {
      alert('Faltan campos por llenar o hay errores en el formulario');
    }
    // Verificamos si las contraseñas no coinciden
    else if (this.userRegister.errors?.['passwordsMismatch']) {
      alert('Las contraseñas no coinciden');
    }
    // Si todo está bien, enviamos los datos
    else {
      // Se elimina el campo confirmPassword para que no se envíe
      const { confirmPassword, ...formValue } = this.userRegister.value;

      // Agregamos el campo state, que siempre sera true
      const dataToSend = { ...formValue, state: true };

      this.usersService.createUser(dataToSend).subscribe({
        next: (response) => {
          alert('Usuario registrado');
        },
        error: (error) => {
          console.error('Error en el registro', error);
          alert(
            'Ocurrió un error durante el registro, verifica la información.'
          );
        },
      });
    }
  }
}
