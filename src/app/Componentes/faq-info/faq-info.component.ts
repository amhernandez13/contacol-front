import { Component } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { HederComponent } from '../header/heder.component';

@Component({
  selector: 'app-faq-info',
  standalone: true,
  imports: [HederComponent, FooterComponent],
  templateUrl: './faq-info.component.html',
  styleUrl: './faq-info.component.css',
})
export class FaqInfoComponent {}
