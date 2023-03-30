import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersTotalsComponent } from './orders-totals.component';

describe('OrdersTotalsComponent', () => {
  let component: OrdersTotalsComponent;
  let fixture: ComponentFixture<OrdersTotalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdersTotalsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdersTotalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
