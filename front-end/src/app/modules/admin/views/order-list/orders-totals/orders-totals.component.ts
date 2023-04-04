import { Component } from '@angular/core';
import { OrderClient, OrderTime } from 'app/core/services/api.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-orders-totals',
  templateUrl: './orders-totals.component.html',
  styleUrls: ['./orders-totals.component.scss']
})
export class OrdersTotalsComponent {

  ordersDate$ = new Observable<OrderTime[]>;
  totalDays = [];

  totalAssemblyTime = 0;
  totalBendingTime = 0;
  totalPreparationTime = 0;
  totalCuttingTime = 0;

  constructor(private orderClient: OrderClient) {
    orderClient.dateList().subscribe(order => {
      console.log("1 " + order);
      this.totalDays.push(order);
      console.log("2 " + this.totalDays[0].assembly);
      this.totalAssemblyTime = this.totalDays[0].assembly;
      this.totalBendingTime = this.totalDays[0].assemblyBendingSum;
      this.totalPreparationTime = this.totalDays[0].assemblyPrepSum;
      this.totalCuttingTime = this.totalDays[0].assemblyCutSum;
    });
  }
}
