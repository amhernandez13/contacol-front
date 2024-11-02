import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuppliersService } from '../../services/suppliers.service';
import { SupplierFormComponent } from '../supplier-form/supplier-form.component';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [CommonModule, FormsModule, SupplierFormComponent],
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.css'],
})
export class SuppliersComponent implements OnInit {
  adata: any[] = [];
  showForm = false;
  selectedSupplier: any = null;
  showConfirmDelete = false; // Controla si se muestra el diálogo de confirmación
  supplierToDelete: any = null; // Almacena el proveedor que se va a eliminar
  filteredSuppliers: any[] = []; // Nueva lista filtrada de proveedores
  searchQuery: string = ''; // Maneja el valor de la búsqueda

  constructor(private suppliersService: SuppliersService) {}

  toastrService = inject(ToastrService);

  ngOnInit(): void {
    this.getAllSuppliers();
  }

  getAllSuppliers() {
    this.suppliersService.getSuppliers().subscribe((data: any[]) => {
      this.adata = data;
      this.filteredSuppliers = this.adata;
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  handleFormClosed() {
    this.showForm = false;
    this.selectedSupplier = null;
    this.getAllSuppliers();
  }

  openForm(supplier: any = null) {
    this.selectedSupplier = supplier;
    this.showForm = true;
  }

  // Mostrar el diálogo de confirmación
  confirmDelete(supplier: any) {
    this.supplierToDelete = supplier;
    this.showConfirmDelete = true;
  }

  // Eliminar el proveedor seleccionado
  deleteSupplier() {
    if (this.supplierToDelete && this.supplierToDelete._id) {
      this.suppliersService
        .deleteSupplierById(this.supplierToDelete._id)
        .subscribe(
          (res: any) => {
            this.toastrService.success('¡Eliminación exitosa!');
            this.getAllSuppliers();
            this.showConfirmDelete = false;
          },
          (error: any) => {
            this.toastrService.error('Error eliminando proveedor');
            this.showConfirmDelete = false;
          }
        );
    }
  }

  // Cancelar la eliminación
  cancelDelete() {
    this.showConfirmDelete = false;
    this.supplierToDelete = null;
  }

  // Método para filtrar proveedores
  filterSuppliers() {
    const query = this.searchQuery.toLowerCase();

    // Si el campo de búsqueda está vacío, mostrar todos los proveedores
    if (!query) {
      this.filteredSuppliers = this.adata;
    } else {
      this.filteredSuppliers = this.adata.filter((supplier) => {
        return (
          supplier.thirdParty.toLowerCase().includes(query) ||
          supplier.nit.toLowerCase().includes(query) ||
          supplier.city.toLowerCase().includes(query)
        );
      });
    }
  }
  // Método para recargar la página
  reloadPage(): void {
    window.location.reload(); // Recarga la página actual
  }
}
