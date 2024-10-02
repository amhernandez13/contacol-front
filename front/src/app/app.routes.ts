import { Routes } from '@angular/router';
import { HomeComponent } from './Componentes/home/home.component';
import { HederComponent } from './Componentes/header/heder.component';
import { LoginComponent } from './Componentes/login/login.component';
import { ProveedoresComponent } from './Componentes/proveedores/proveedores.component';
import { RegistroComponent } from './Componentes/registro/registro.component';
import { UsauriosComponent } from './Componentes/usaurios/usaurios.component';


export const routes: Routes = [
    {path: 'home', component:HomeComponent},
    {path: 'header', component:HederComponent},
    {path: 'login', component:LoginComponent},
    {path: 'proveedores', component:ProveedoresComponent},
    {path: 'registro', component:RegistroComponent},
    {path: 'usuarios', component:UsauriosComponent}, 
    
];
