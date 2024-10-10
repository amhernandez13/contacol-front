import { Component, EventEmitter, Output } from '@angular/core'; // Añadimos EventEmitter y Output
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
  showPassword: boolean = false;

  constructor(private usersService: UsersService) {
    this.userRegister = new FormGroup(
      {
        name: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          this.passwordStrengthValidator, // Validador personalizado para fuerza de contraseña
        ]),
        confirmPassword: new FormControl('', Validators.required),
        role: new FormControl('', Validators.required),
      },
      { validators: this.passwordMatchValidator }
    );
  }

  // Validador para confirmar que las contraseñas coinciden
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  // Validador de fuerza de contraseña
  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    return regex.test(password)
      ? null
      : {
          passwordStrength: true, // Si no cumple con la expresión regular, lanzamos este error
        };
  }

  // Alternar la visibilidad de las contraseñas
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Método para enviar el formulario
  onSubmit() {
    if (this.userRegister.valid) {
      const { confirmPassword, ...formValue } = this.userRegister.value;
      const dataToSend = { ...formValue, state: true };

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
    } else if (
      this.userRegister.get('password')?.errors?.['passwordStrength']
    ) {
      alert(
        'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, un número y un carácter especial.'
      );
    } else {
      alert('Faltan campos por llenar.');
    }
  }
}
