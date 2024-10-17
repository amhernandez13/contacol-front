import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para standalone components
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms'; // Para trabajar con ngModel
import Swal from 'sweetalert2'; // SweetAlert importación correcta
import { SuppliersService } from '../../services/suppliers.service';
import { HttpClientModule } from '@angular/common/http';

declare var $: any;

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule], // Importando CommonModule y FormsModule para standalone components
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.css'],
})
export class SuppliersComponent {}
