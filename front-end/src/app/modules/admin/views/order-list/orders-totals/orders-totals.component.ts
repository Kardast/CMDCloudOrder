import { Component, Input } from '@angular/core';
import { Order, OrderClient, OrderTime } from 'app/core/services/api.service';
import { Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-orders-totals',
  templateUrl: './orders-totals.component.html',
  styleUrls: ['./orders-totals.component.scss']
})
export class OrdersTotalsComponent {

  @Input() orders$: Observable<Order[]>;

  ordersDate$ = new Observable<OrderTime[]>;
  listDays = [];

  constructor(private orderClient: OrderClient) { };

  ngOnChanges() {
    this.ordersDate$ = this.orders$.pipe(
      switchMap(_ => this.orderClient.dateList())
    );
    
    this.updateTotal()
  }

  updateTotal() {
    this.ordersDate$.subscribe(order => {
      this.listDays = [];
      this.listDays.push(order)
    })
  }
}
