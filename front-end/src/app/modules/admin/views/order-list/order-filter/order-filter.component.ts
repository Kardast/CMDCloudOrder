import { Component, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-order-filter',
  templateUrl: './order-filter.component.html',
  styleUrls: ['./order-filter.component.scss']
})
export class OrderFilterComponent {
  @Input() searchFilter$ : BehaviorSubject<{ customer?: string; orderNumber?: string }>;

  searchCustomer: string = '';
  searchOrderNumber: string = '';

  searchCustomerKeyUp() {
    this.searchFilter$.next({ ...this.searchFilter$.value, customer: this.searchCustomer });
  }

  searchOrderNumberKeyUp() {
    this.searchFilter$.next({ ...this.searchFilter$.value, orderNumber: this.searchOrderNumber });
  }
}