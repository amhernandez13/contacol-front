import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceWarehouseComponent } from './invoice-warehouse.component';

describe('InvoiceWarehouseComponent', () => {
  let component: InvoiceWarehouseComponent;
  let fixture: ComponentFixture<InvoiceWarehouseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceWarehouseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InvoiceWarehouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
