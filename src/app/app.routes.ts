import { Routes } from '@angular/router';
import { HomeComponent } from './Componentes/home/home.component';
import { LoginComponent } from './Componentes/login/login.component';
import { StorageComponent } from './Componentes/storage/storage.component';
import { FaqInfoComponent } from './Componentes/faq-info/faq-info.component';
import { UserListComponent } from './superAdmin/user-list/user-list.component';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'faq', component: FaqInfoComponent },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [roleGuard],
    data: { role: ['admin'] },
  },
  {
    path: 'storage',
    component: StorageComponent,
    canActivate: [roleGuard],
    data: { role: ['admin', 'accountant'] },
  },
  {
    path: 'user-list',
    component: UserListComponent,
    canActivate: [roleGuard],
    data: { role: ['superAdmin'] },
  },
  { path: '**', redirectTo: '' }, // Ruta comodín redirige al login
];
