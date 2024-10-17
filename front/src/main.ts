import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core'; // Necesario para importar HttpClientModule
import { HttpClientModule } from '@angular/common/http'; // Importamos HttpClientModule

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    importProvidersFrom(HttpClientModule), // Añadimos HttpClientModule aquí
    ...appConfig.providers, // Asegúrate de mantener los otros providers
  ],
}).catch((err) => console.error(err));
