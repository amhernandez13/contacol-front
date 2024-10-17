import { Component, inject } from '@angular/core';
import { SuppliersService } from '../../services/suppliers.service';
@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [],
  templateUrl: './suppliers.component.html',
  styleUrl: './suppliers.component.css',
})
export class SuppliersComponent {
  suplier = inject(SuppliersService);
  adata: any[] = [];

  getallSuppliers() {
    this.suplier.getSuppliers().subscribe((answer: any) => {
      console.log('ans: ', answer);
      if (answer) {
        this.adata = answer;
        console.log('Suppliers read correctly');
      } else {
        console.log('ups an error has ocurred');
      }
      this.adata = answer;
    });
  }
  ngOnInit() {
    this.getallSuppliers();
  }
}
