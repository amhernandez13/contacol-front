import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderAccountantComponent } from './header-accountant.component';

describe('HeaderAccountantComponent', () => {
  let component: HeaderAccountantComponent;
  let fixture: ComponentFixture<HeaderAccountantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderAccountantComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeaderAccountantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
