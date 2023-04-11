import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { BehaviorSubject, combineLatest, Observable, switchMap } from 'rxjs';
import { Order, OrderClient, OrderPagedResultDto } from 'app/core/services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@UntilDestroy()
@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements AfterViewInit {
  columnsToDisplay = ['id', 'customer', 'orderNumber', 'cuttingDate', 'preparationDate', 'bendingDate', 'assemblyDate', 'action'];
  focusedOrder = new BehaviorSubject<Order | null>(null);
  searchFilter$ = new BehaviorSubject<{ customer?: string; orderNumber?: string }>({});
  orderCreate$ = new BehaviorSubject<Order | null>(null);
  orderUpdate$ = new BehaviorSubject<Order | null>(null);
  orderDelete$ = new BehaviorSubject<Order | null>(null);
  orders$ = new Observable<OrderPagedResultDto>();
  totalCount$ = new BehaviorSubject<number>(0);
  dataSource = new MatTableDataSource<Order>();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private orderClient: OrderClient) {
  }

  ngAfterViewInit() {
    this.orders$ = combineLatest([this.searchFilter$, this.orderCreate$, this.orderUpdate$, this.orderDelete$])
      .pipe(switchMap(([filter]) => this.orderClient.list(filter.customer, filter.orderNumber, this.paginator.pageIndex + 1, this.paginator.pageSize)));

    this.paginator.page.subscribe(() => {
      this.refreshOrders();
    });
    this.refreshOrders();
  }

  refreshOrders() {
    this.orders$.subscribe(order => {
      this.dataSource.data = order.items;
      this.totalCount$.next(order.totalCount);
    });
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

  onPageChange(event: any) {
    this.refreshOrders();
  }
}
