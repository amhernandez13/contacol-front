import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para standalone components
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';  // Para trabajar con ngModel
import Swal from 'sweetalert2'; // SweetAlert importación correcta
import { SuppliersService } from '../../services/suppliers.service';
import { HttpClientModule } from '@angular/common/http';

declare var $: any;




@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [CommonModule, FormsModule,HttpClientModule], // Importando CommonModule y FormsModule para standalone components
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.css'], 
})
export class SuppliersComponent implements OnInit {
 
  suppliersForm: FormGroup;

  constructor(private fb: FormBuilder, private suppliersService: SuppliersService) {
    this.suppliersForm = this.fb.group({
      thirdParty: ['', Validators.required],
      nit: ['', Validators.required],
      department: ['', Validators.required],
      city: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.suppliersService .getSupplier().subscribe((data) => (data));
  }

  onSubmit() {
    if (this.suppliersForm.valid) {
      this.suppliersService.createSupplier(this.suppliersForm.value).subscribe(
        response => {
          console.log('Proveedor creado exitosamente', response);
          // Maneja la respuesta, posiblemente mostrar un mensaje de éxito
        },
        error => {
          console.error('Error al crear el proveedor', error);
          // Maneja el error
        }
      );
    } else {
      console.log('Formulario no válido');
    }
  }
}


  

