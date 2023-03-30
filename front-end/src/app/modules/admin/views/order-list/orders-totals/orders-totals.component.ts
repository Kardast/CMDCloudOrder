import { Component, Input } from '@angular/core';
import { Order, OrderClient } from 'app/core/services/api.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-orders-totals',
    templateUrl: './orders-totals.component.html',
    styleUrls: ['./orders-totals.component.scss']
})
export class OrdersTotalsComponent {
    @Input() orders$: Observable<Order[]>;

    totalAssemblyTime = 0;
    totalBendingTime = 0;
    totalPreparationTime = 0;
    totalCuttingTime = 0;
    totalRecords = 0;

    constructor(private orderClient: OrderClient) {
        this.orders$ = this.orderClient.list();
        this.getTotalDays();
    }

    getTotalDays() {
        this.orders$.subscribe(orders => {
            orders.forEach((order) => {
                let assemblyDate = new Date(order.assemblyDate);
                this.totalAssemblyTime ++;

                let preparationDate = new Date(order.preparationDate);
                this.totalPreparationTime += this.getDiffDays(assemblyDate, preparationDate);

                let bendingDate = new Date(order.bendingDate);
                this.totalBendingTime += this.getDiffDays(assemblyDate, bendingDate);

                let cuttingDate = new Date(order.cuttingDate);
                this.totalCuttingTime += this.getDiffDays(assemblyDate, cuttingDate);

                this.totalRecords ++;
            });
        });
    }

    getDiffDays(endDate: Date, startDate: Date) {
        let diffTime = endDate.getTime() - startDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        console.log(diffDays);
        return diffDays;
    }
}
