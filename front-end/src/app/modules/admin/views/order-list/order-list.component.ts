import { Component, Input } from '@angular/core';
import 'devextreme/data/odata/store';
import { UntilDestroy } from '@ngneat/until-destroy';
import { BehaviorSubject, combineLatest, Observable, switchMap } from 'rxjs';
import { Order, OrderClient } from 'app/core/services/api.service';

@UntilDestroy()
@Component({
    selector: 'app-order-list',
    templateUrl: './order-list.component.html',
    styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent {
    // @Input() focusedOrder = new BehaviorSubject<Order | null>(null);
    // @Input() orderCreate$ = new BehaviorSubject<Order | null>(null);
    // @Input() orderUpdate$ = new BehaviorSubject<Order | null>(null);

    searchCustomer: string = '';
    searchOrderNumber: string = '';
    columnsToDisplay = ['id', 'customer', 'orderNumber', 'cuttingDate', 'preparationDate', 'bendingDate', 'assemblyDate', 'action'];

    focusedOrder = new BehaviorSubject<Order | null>(null);
    searchFilter$ = new BehaviorSubject<{ customer?: string; orderNumber?: string }>({});
    orderCreate$ = new BehaviorSubject<Order | null>(null);
    orderUpdate$ = new BehaviorSubject<Order | null>(null);
    orderDelete$ = new BehaviorSubject<Order | null>(null);
    orders$ = new Observable<Order[]>;

    constructor(private orderClient: OrderClient) {
        this.orders$ = combineLatest([this.searchFilter$, this.orderCreate$, this.orderUpdate$, this.orderDelete$])
            .pipe(switchMap(([filter]) => this.orderClient.list(filter.customer, filter.orderNumber)));
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
    searchCustomerKeyUp() {
        this.searchFilter$.next({ ...this.searchFilter$.value, customer: this.searchCustomer });
    }

    searchOrderNumberKeyUp() {
        this.searchFilter$.next({ ...this.searchFilter$.value, orderNumber: this.searchOrderNumber });
    }
}

