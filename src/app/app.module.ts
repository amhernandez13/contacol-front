import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms'; // Importa ReactiveFormsModule
import { AppComponent } from './app.component';



@NgModule({
  declarations:[

    
  ],                             // Asegúrate de que el componente está declarado aquí
  
  
  imports:[ 
    BrowserModule, 
    ReactiveFormsModule
], // Asegúrate de importar ReactiveFormsModule
  
  providers: []
})
export class AppModule { }
