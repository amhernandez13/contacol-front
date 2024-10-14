import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-invoices-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './invoices-form.component.html',
  styleUrl: './invoices-form.component.css',
})
export class InvoicesFormComponent {
  invoiceForm: FormGroup;

  constructor() {
    this.invoiceForm = new FormGroup({
      issue_date: new FormControl(''),
      invoice_type: new FormControl(''),
      payment_method: new FormControl(''),
      invoice: new FormControl(''),
      third_party: new FormControl(''),
      invoice_status: new FormControl(''),
      due_date: new FormControl(''),
      description: new FormControl(''),
      payment_way: new FormControl(''),
      paid_value: new FormControl(''),
      payment_date: new FormControl(''),
      invoice_total: new FormControl(''),
      taxes_total: new FormControl(''),
      rte_fuente: new FormControl(''),
      rte_iva: new FormControl(''),
      rte_ica: new FormControl(''),
      observation: new FormControl(''),
      department: new FormControl(''),
      city: new FormControl(''),
    });
  }

  onSubmit() {
    const formData = this.invoiceForm.value;
    const invoiceData = {
      issue_date: formData.issue_date,
      invoice_type: formData.invoice_type,
      payment_method: formData.payment_method,
      invoice: formData.invoice,
      third_party: formData.third_party,
      invoice_status: formData.invoice_status,
      due_date: formData.due_date,
      description: formData.description,
      payment_way: formData.payment_way,
      paid_value: formData.paid_value,
      payment_date: formData.payment_date,
      invoice_total: formData.invoice_total,
      taxes_total: formData.taxes_total,
      rte_fuente: formData.rte_fuente,
      rte_iva: formData.rte_iva,
      rte_ica: formData.rte_ica,
      observation: formData.observation,
      department: formData.department,
      city: formData.city,
    };

    console.log(JSON.stringify(invoiceData, null, 2));
  }
}
