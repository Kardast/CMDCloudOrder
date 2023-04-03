import { Component, Input } from '@angular/core';
import { Order, OrderClient, OrderTime } from 'app/core/services/api.service';
import { Observable, combineLatest, switchMap } from 'rxjs';

@Component({
  selector: 'app-orders-totals',
  templateUrl: './orders-totals.component.html',
  styleUrls: ['./orders-totals.component.scss']
})
export class OrdersTotalsComponent {

  ordersDate$: Observable<OrderTime[]>;
  totalDays : [];
  totalAssemblyTime = 0;
  totalBendingTime = 0;
  totalPreparationTime = 0;
  totalCuttingTime = 0;

  constructor(private orderClient: OrderClient) {
    
    orderClient.dateList().subscribe(() => {
      this.ordersDate$ = orderClient.dateList();
    }
    )
  }

  ngOnChanges() {
    this.updateTotals();
  }

  updateTotals() {
    this.orderClient.dateList().subscribe(() => {
      this.ordersDate$ = this.orderClient.dateList();
    })
  }
}
    // this.orderClient.dateList().subscribe(() => {
    //   this.ordersDate$ = this.orderClient.dateList().subscribe(order =>{
    //     this.totalDays.push(order);
    //     this.totalAssemblyTime = this.totalDays[0].assembly;
    //     this.totalBendingTime = this.totalDays[0].assemblyBendingSum;
    //     this.totalPreparationTime = this.totalDays[0].assemblyPrepSum;
    //     this.totalCuttingTime = this.totalDays[0].assemblyCutSum;
    //   });
    // })