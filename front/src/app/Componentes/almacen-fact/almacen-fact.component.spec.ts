import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlmacenFactComponent } from './almacen-fact.component';

describe('AlmacenFactComponent', () => {
  let component: AlmacenFactComponent;
  let fixture: ComponentFixture<AlmacenFactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlmacenFactComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlmacenFactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
