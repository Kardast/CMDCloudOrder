import { Component, Input } from '@angular/core';
import { Order } from 'app/core/services/api.service';
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

    ngOnChanges() {
        this.updateTotals();
    }

    updateTotals() {
        this.orders$.subscribe(orders => {
            this.totalAssemblyTime = orders.reduce((acc) => {
                return acc + 1;
            }, 0);
            this.totalPreparationTime = orders.reduce((acc, order) => {
                const assemblyDate = new Date(order.assemblyDate);
                const preparationDate = new Date(order.preparationDate);
                return acc + this.getDiffDays(assemblyDate, preparationDate);
            }, 0);
            this.totalBendingTime = orders.reduce((acc, order) => {
                const assemblyDate = new Date(order.assemblyDate);
                const bendingDate = new Date(order.bendingDate);
                return acc + this.getDiffDays(assemblyDate, bendingDate);
            }, 0);
            this.totalCuttingTime = orders.reduce((acc, order) => {
                const assemblyDate = new Date(order.assemblyDate);
                const cuttingDate = new Date(order.cuttingDate);
                return acc + this.getDiffDays(assemblyDate, cuttingDate);
            }, 0);
        });
    }

    getDiffDays(endDate: Date, startDate: Date) {
        let diffTime = endDate.getTime() - startDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }
}