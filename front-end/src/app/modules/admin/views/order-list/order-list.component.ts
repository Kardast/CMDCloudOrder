import { Component, Input, ViewChild } from '@angular/core';
import 'devextreme/data/odata/store';
import { UntilDestroy } from '@ngneat/until-destroy';
import { BehaviorSubject, combineLatest, Observable, switchMap } from 'rxjs';
import { Order, OrderClient } from 'app/core/services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@UntilDestroy()
@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent {
  columnsToDisplay = ['id', 'customer', 'orderNumber', 'cuttingDate', 'preparationDate', 'bendingDate', 'assemblyDate', 'action'];
  focusedOrder = new BehaviorSubject<Order | null>(null);
  searchFilter$ = new BehaviorSubject<{ customer?: string; orderNumber?: string }>({});
  orderCreate$ = new BehaviorSubject<Order | null>(null);
  orderUpdate$ = new BehaviorSubject<Order | null>(null);
  orderDelete$ = new BehaviorSubject<Order | null>(null);
  orders$ = new Observable<Order[]>;
  dataSource = new MatTableDataSource<Order>();
  @ViewChild('paginator') paginator: MatPaginator;

  constructor(private orderClient: OrderClient) {
    this.orders$ = combineLatest([this.searchFilter$, this.orderCreate$, this.orderUpdate$, this.orderDelete$])
      .pipe(switchMap(([filter]) => this.orderClient.list(filter.customer, filter.orderNumber)));
  }

  ngAfterViewInit() {
    this.orders$.subscribe(order => {
      this.dataSource.data = order;
      this.dataSource.paginator = this.paginator;
    })
  }

  deleteOrder(order: any, event: MouseEvent) {
    event.stopPropagation();

    if (!order?.id || order?.id === 0) {
      return;
    }

    this.orderClient
      .delete(order.id)
      .subscribe(() => this.orderDelete$.next(order));

    this.focusedOrder.next(null);
  }
}
