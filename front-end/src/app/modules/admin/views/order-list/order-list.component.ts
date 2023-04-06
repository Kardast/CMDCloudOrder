import { Component, Input, ViewChild } from '@angular/core';
import 'devextreme/data/odata/store';
import { UntilDestroy } from '@ngneat/until-destroy';
import { BehaviorSubject, combineLatest, map, Observable, switchMap } from 'rxjs';
import { Order, OrderClient, OrderPaginatedResult } from 'app/core/services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@UntilDestroy()
@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent {
  columnsToDisplay = ['id', 'customer', 'orderNumber', 'cuttingDate', 'preparationDate', 'bendingDate', 'assemblyDate', 'action'];
  focusedOrder = new BehaviorSubject<Order | null>(null);
  searchFilter$ = new BehaviorSubject<{ customer?: string; orderNumber?: string; pageIndex?: number; pageSize?: number }>({});
  orderCreate$ = new BehaviorSubject<Order | null>(null);
  orderUpdate$ = new BehaviorSubject<Order | null>(null);
  orderDelete$ = new BehaviorSubject<Order | null>(null);
  orders$ = new Observable<OrderPaginatedResult>;
  pageSize$ = this.orders$.pipe(map(paginatedResult => paginatedResult.pageSize));
  pageIndex$ = this.orders$.pipe(map(paginatedResult => paginatedResult.pageIndex));
  totalCount$ = this.orders$.pipe(map(paginatedResult => paginatedResult.totalCount));
  dataSource = new MatTableDataSource<Order>();
  totalRecords: number;
  @ViewChild('paginator') paginator: MatPaginator;

  constructor(private orderClient: OrderClient) {
    this.orders$ = combineLatest([this.searchFilter$, this.orderCreate$, this.orderUpdate$, this.orderDelete$])
      .pipe(
        switchMap(([filter]) =>
          this.orderClient.list(
            filter.customer,
            filter.orderNumber,
            filter.pageIndex ?? 1,
            filter.pageSize ?? 10
          )
        )
      );
  }

  ngAfterViewInit() {
    this.orders$.subscribe(paginatedResult => {
      this.totalRecords = paginatedResult.totalCount;
      console.log(this.totalRecords);

      console.log(paginatedResult);

      this.dataSource.data = paginatedResult.items;
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

  onPageChanged(event: PageEvent): void {
    // console.log(event);

    const filter = this.searchFilter$.value;
    // console.log(filter);

    filter.pageIndex = event.pageIndex + 1;
    console.log(filter.pageIndex);

    filter.pageSize = event.pageSize;
    console.log(filter.pageSize);

    this.searchFilter$.next(filter);
    console.log(this.totalRecords);

  }
}
