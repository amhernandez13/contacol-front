import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {
  constructor(private router: Router) {}

  // Método para navegar a la ruta FAQ
  goToFAQ() {
    const url = this.router.serializeUrl(this.router.createUrlTree(['/faq']));
    window.open(url, '_blank');
  }
}
