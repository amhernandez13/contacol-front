import { Routes } from '@angular/router';
import { HomeComponent } from './Componentes/home/home.component';
import { LoginComponent } from './Componentes/login/login.component';
import { InvoiceWarehouseComponent } from './Componentes/invoice-warehouse/invoice-warehouse.component';
import { InvoicesComponent } from './Componentes/invoices/invoices.component';
import { SuppliersComponent } from './Componentes/suppliers/suppliers.component';
import { UsersComponent } from './Componentes/users/users.component';
import { VouchersComponent } from './Componentes/vouchers/vouchers.component';
import { InvoicesFormComponent } from './Componentes/invoices-form/invoices-form.component';
import { StorageComponent } from './Componentes/storage/storage.component';
import { UserListComponent } from './superAdmin/user-list/user-list.component';
import { HederComponent } from './Componentes/header/heder.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'header', component: HederComponent },
  { path: 'login', component: LoginComponent },
  { path: 'invoice-warehouse', component: InvoiceWarehouseComponent },
  { path: 'invoices', component: InvoicesComponent },
  { path: 'suppliers', component: SuppliersComponent },
  { path: 'users', component: UsersComponent },
  { path: 'vouchers', component: VouchersComponent },
  { path: 'login', component: LoginComponent },
  { path: 'invpoces', component: InvoicesFormComponent },
  { path: 'storage', component: StorageComponent },
  { path: 'user-list', component: UserListComponent },
  { path: 'invoices-form', component: InvoicesFormComponent },
];
