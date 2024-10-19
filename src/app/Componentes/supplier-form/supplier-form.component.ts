import {
  Component,
  inject,
  Input,
  Output,
  EventEmitter,
  OnInit,
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SupplierModel } from '../../interfaces/supplier-model';
import { SuppliersService } from '../../services/suppliers.service';
import { FooterComponent } from '../footer/footer.component';
import { HederComponent } from '../header/heder.component';

@Component({
  selector: 'app-supplier-form',
  standalone: true,
  imports: [ReactiveFormsModule, HederComponent, FooterComponent],
  templateUrl: './supplier-form.component.html',
  styleUrls: ['./supplier-form.component.css'],
})
export class SupplierFormComponent implements OnInit {
  @Input() supplier: SupplierModel | null = null; // Input para recibir datos del proveedor
  @Output() formClosed = new EventEmitter<void>(); // Output para notificar al padre cuando se cierra el formulario

  router = inject(Router);
  toastrService = inject(ToastrService);
  // toastrService = inject(ToastrService);
  SuppliersService: SuppliersService = inject(SuppliersService);

  newSupplierData = new FormGroup({
    thirdPartyData: new FormControl<string>('', [Validators.required]),
    nitData: new FormControl<number | null>(null, [Validators.required]),
    phoneData: new FormControl<number | null>(null, [Validators.required]),
    emailData: new FormControl<string>('', [
      Validators.required,
      Validators.email,
    ]),
    cityData: new FormControl<string>('', [Validators.required]),
    departmentData: new FormControl<string>('', [Validators.required]),
  });

  ngOnInit() {
    // Si se pasa un proveedor, se rellenan los campos del formulario
    if (this.supplier) {
      this.newSupplierData.patchValue({
        thirdPartyData: this.supplier.thirdParty.valueOf(),
        nitData: Number(this.supplier.nit),
        phoneData: Number(this.supplier.phone),
        emailData: this.supplier.email.valueOf(),
        cityData: this.supplier.city.valueOf(),
        departmentData: this.supplier.department.valueOf(),
      });
    }
  }

  handleNewSupplierSubmit() {
    if (this.newSupplierData.valid) {
      const thirdParty = this.newSupplierData.value.thirdPartyData;
      const nitNumber = this.newSupplierData.value.nitData;
      const phoneNumber = this.newSupplierData.value.phoneData;
      const email = this.newSupplierData.value.emailData;
      const city = this.newSupplierData.value.cityData;
      const department = this.newSupplierData.value.departmentData;

      // Verificar que nitNumber y phoneNumber no sean null o undefined
      if (nitNumber == null || phoneNumber == null) {
        this.toastrService.warning('NIT y Teléfono deben ser números válidos');
        return;
      }

      // Convertir los números a cadenas antes de crear el objeto para el backend (ya que se reciben en tipo number)
      const newSupplier: SupplierModel = {
        thirdParty: thirdParty!,
        nit: nitNumber.toString(),
        phone: phoneNumber.toString(),
        email: email!,
        city: city!,
        department: department!,
      };

      // Verificamos si es un nuevo proveedor POST o una actualización PUT
      if (this.supplier?._id) {
        this.SuppliersService.updateSupplier(
          this.supplier._id,
          newSupplier
        ).subscribe(
          (res: any) => {
            console.log('Proveedor actualizado: ', res);
            this.toastrService.success('¡Proveedor actualizado con éxito!');
            this.closeForm();
          },
          (error: any) => {
            console.error('Error actualizando proveedor: ', error);
            this.toastrService.error('Error actualizando proveedor');
          }
        );
      } else {
        // Crear nuevo proveedor POST
        this.SuppliersService.createSupplier(newSupplier).subscribe(
          (res: any) => {
            console.log('Proveedor creado: ', res);
            this.toastrService.success('¡Proveedor agregado con éxito!');
            this.closeForm();
          },
          (error) => {
            console.error('Error creando proveedor: ', error);
            this.toastrService.error('Error creando proveedor');
          }
        );
      }
    } else {
      this.toastrService.warning('Campos vacíos o CORREO inválido');
    }
  }

  // Métodos para manejar la entrada de NIT y Teléfono como números
  onNitInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.valueAsNumber;
    this.newSupplierData.patchValue({ nitData: isNaN(value) ? null : value });
  }

  onPhoneInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.valueAsNumber;
    this.newSupplierData.patchValue({ phoneData: isNaN(value) ? null : value });
  }

  // Método para cerrar el formulario y emitir el evento
  closeForm() {
    this.formClosed.emit();
  }
}
