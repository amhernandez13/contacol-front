import {
  Component,
  Input,
  EventEmitter,
  Output,
  OnInit,
  inject,
} from '@angular/core';
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
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-register-form',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule],
  templateUrl: './user-register-form.component.html',
  styleUrls: ['./user-register-form.component.css'],
})
export class UserRegisterFormComponent implements OnInit {
  @Input() user: any = null; // Recibe el usuario a editar
  @Output() userRegistered = new EventEmitter<void>(); // Emitimos evento al registrar
  @Output() userEdited = new EventEmitter<void>(); // Emitimos evento al editar

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
          this.passwordStrengthValidator,
        ]),
        confirmPassword: new FormControl('', Validators.required),
        role: new FormControl('', Validators.required),
      },
      { validators: this.passwordMatchValidator }
    );
  }

  toastrService = inject(ToastrService);

  ngOnInit(): void {
    if (this.user) {
      this.userRegister.patchValue(this.user); // Cargar los datos del usuario para edición
    }
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
    return regex.test(password) ? null : { passwordStrength: true };
  }

  // Alternar visibilidad de la contraseña
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Método para enviar el formulario
  onSubmit() {
    if (this.userRegister.valid) {
      const { confirmPassword, ...formValue } = this.userRegister.value;
      const dataToSend = { ...formValue, state: true };

      if (this.user) {
        // Actualizamos el usuario si ya existe (modo edición)
        const userId = this.user._id;
        this.usersService.updateUser(userId, dataToSend).subscribe({
          next: (response) => {
            this.toastrService.success('Usuario actualizado correctamente');
            this.userEdited.emit(); // Emitimos evento de usuario editado
          },
          error: (error) => {
            console.error('Error al actualizar el usuario', error);
            this.toastrService.error(
              'Ocurrió un error durante la actualización.'
            );
          },
        });
      } else {
        // Creamos un nuevo usuario (modo creación)
        this.usersService.createUser(dataToSend).subscribe({
          next: (response) => {
            this.toastrService.success('Usuario registrado correctamente');
            this.userRegistered.emit(); // Emitimos evento de usuario registrado
          },
          error: (error) => {
            console.error('Error al registrar el usuario', error);
            this.toastrService.error('Ocurrió un error durante el registro.');
          },
        });
      }
    } else if (this.userRegister.errors?.['passwordsMismatch']) {
      this.toastrService.warning('Las contraseñas no coinciden');
    } else if (
      this.userRegister.get('password')?.errors?.['passwordStrength']
    ) {
      this.toastrService.warning(
        'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, un número y un carácter especial.'
      );
    } else {
      this.toastrService.warning('Faltan campos por llenar.');
    }
  }
}
