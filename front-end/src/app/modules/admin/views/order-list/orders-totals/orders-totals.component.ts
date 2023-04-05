import { Component, Input } from '@angular/core';
import { Order, OrderClient, OrderTime } from 'app/core/services/api.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-orders-totals',
  templateUrl: './orders-totals.component.html',
  styleUrls: ['./orders-totals.component.scss']
})
export class OrdersTotalsComponent {
  @Input() orders$: Observable<Order[]>;

  ordersDate$ = new Observable<OrderTime[]>;
  totalDays = [];

  constructor(private orderClient: OrderClient) {
  }

  ngOnChanges() {
    this.orders$.subscribe(_ => {
      this.ordersDate$ = this.orderClient.dateList();
      this.updateTotals();
    })
  }

  updateTotals() {
    this.ordersDate$.subscribe(order => {
      this.totalDays = [];
      this.totalDays.push(order);
    });
  }
}
