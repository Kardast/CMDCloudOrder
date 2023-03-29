import { Component, Input } from '@angular/core';
import 'devextreme/data/odata/store';
import { UntilDestroy } from '@ngneat/until-destroy';
import { BehaviorSubject, combineLatest, Observable, switchMap } from 'rxjs';
import { Order } from 'app/common/clients/api.clients';

@UntilDestroy()
@Component({
    selector: 'app-order-list',
    templateUrl: './order-list.component.html',
    styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent {
    @Input() focusedOrder = new BehaviorSubject<Order | null>(null);
    @Input() orderCreate$ = new BehaviorSubject<Order | null>(null);
    @Input() orderUpdate$ = new BehaviorSubject<Order | null>(null);

    searchCustomer: string = '';
    searchOrderNumber: string = '';
    columnsToDisplay = ['id', 'customer', 'orderNumber', 'cuttingDate', 'preparationDate', 'bendingDate', 'assemblyDate', 'action'];

    searchFilter$ = new BehaviorSubject<{ customer?: string; orderNumber?: string }>({});
    orderDelete$ = new BehaviorSubject<Order | null>(null);
    orders$ = new Observable<Order[]>;

    orders = [
        {
            id: 1,
            customer: "test",
            orderNumber: "12/12/2012",
            cuttingDate: "12/12/2012",
            preparationDate: "12/12/2012",
            bendingDate: "12/12/2012",
            assemblyDate: "12/12/2012",
        },
        {
            id: 1,
            customer: "test",
            orderNumber: "12/12/2012",
            cuttingDate: "12/12/2012",
            preparationDate: "12/12/2012",
            bendingDate: "12/12/2012",
            assemblyDate: "12/12/2012",
        }, {
            id: 1,
            customer: "test",
            orderNumber: "12/12/2012",
            cuttingDate: "12/12/2012",
            preparationDate: "12/12/2012",
            bendingDate: "12/12/2012",
            assemblyDate: "12/12/2012",
        }, {
            id: 1,
            customer: "test",
            orderNumber: "12/12/2012",
            cuttingDate: "12/12/2012",
            preparationDate: "12/12/2012",
            bendingDate: "12/12/2012",
            assemblyDate: "12/12/2012",
        },
    ]



    // ngOnChanges(): void {
    //   this.orders$ = combineLatest([this.searchFilter$, this.orderCreate$, this.orderUpdate$, this.orderDelete$])
    //     .pipe(switchMap(([filter]) => this.orderClient.list(filter.customer, filter.orderNumber)));
    // }

    // constructor(private orderClient: OrderClient) { }
    constructor() { }


    deleteOrder(order: any, event: MouseEvent) {
        event.stopPropagation();

        if (!order?.id || order?.id === 0) {
            return;
        }

        //   this.orderClient
        //     .delete(order.id)
        //     .subscribe(() => this.orderDelete$.next(order));

        this.focusedOrder.next(null);
    }
    searchCustomerKeyUp() {
        this.searchFilter$.next({ ...this.searchFilter$.value, customer: this.searchCustomer });
    }

    searchOrderNumberKeyUp() {
        this.searchFilter$.next({ ...this.searchFilter$.value, orderNumber: this.searchOrderNumber });
    }
}

