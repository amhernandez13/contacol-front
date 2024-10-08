import { Component, EventEmitter, Output } from '@angular/core';
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
  styleUrls: ['./user-register-form.component.css'],
})
export class UserRegisterFormComponent {
  @Output() userRegistered = new EventEmitter<void>(); // Emitimos evento al registrar

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
      { validators: this.passwordValidator } // Validador personalizado de contraseñas
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
    if (this.userRegister.valid) {
      // Excluir el campo confirmPassword antes de enviar los datos
      const { confirmPassword, ...formValue } = this.userRegister.value;

      // Agregamos el campo state, que siempre sera true
      const dataToSend = { ...formValue, state: true };

      // Enviamos el formulario al backend
      this.usersService.createUser(dataToSend).subscribe({
        next: (response) => {
          alert('Usuario registrado');
          this.userRegistered.emit(); // Emitimos el evento al registrar correctamente
        },
        error: (error) => {
          console.error('Error en el registro', error);
          alert(
            'Ocurrió un error durante el registro, verifica la información.'
          );
        },
      });
    } else if (this.userRegister.errors?.['passwordsMismatch']) {
      alert('Las contraseñas no coinciden');
    } else {
      alert('Faltan campos por llenar o hay errores en el formulario');
    }
  }
}
