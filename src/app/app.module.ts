import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms'; // Importa ReactiveFormsModule
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [], // Asegúrate de que el componente está declarado aquí

  imports: [BrowserModule, ReactiveFormsModule, FormsModule], // Asegúrate de importar ReactiveFormsModule

  providers: [],
})
export class AppModule {}
