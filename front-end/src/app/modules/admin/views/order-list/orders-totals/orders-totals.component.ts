import { Component, Input } from '@angular/core';
import { Order, OrderClient } from 'app/core/services/api.service';
import { BehaviorSubject, combineLatest, Observable, switchMap } from 'rxjs';

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

    ngOnChanges() {
        this.updateTotals()
    }

    updateTotals() {
        this.orders$.subscribe(orders => {

            this.totalAssemblyTime = 0;
            this.totalBendingTime = 0;
            this.totalPreparationTime = 0;
            this.totalCuttingTime = 0;
            this.totalRecords = 0;
            this.totalRecords = orders.length;

            orders.forEach((order) => {
                let assemblyDate = new Date(order.assemblyDate);
                this.totalAssemblyTime++;

                let preparationDate = new Date(order.preparationDate);
                this.totalPreparationTime += this.getDiffDays(assemblyDate, preparationDate);

                let bendingDate = new Date(order.bendingDate);
                this.totalBendingTime += this.getDiffDays(assemblyDate, bendingDate);

                let cuttingDate = new Date(order.cuttingDate);
                this.totalCuttingTime += this.getDiffDays(assemblyDate, cuttingDate);
            });
        });
    }

    getDiffDays(endDate: Date, startDate: Date) {
        let diffTime = endDate.getTime() - startDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }
}