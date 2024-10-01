import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsauriosComponent } from './usaurios.component';

describe('UsauriosComponent', () => {
  let component: UsauriosComponent;
  let fixture: ComponentFixture<UsauriosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsauriosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UsauriosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
