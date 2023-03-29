import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Order } from 'app/common/clients/api.clients';
import { serializeDateOnly } from 'app/shared/utils/dateonly.utils';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Component({
    selector: 'app-order-form',
    templateUrl: './order-form.component.html',
    styleUrls: ['./order-form.component.scss']
})
export class OrderFormComponent {
    @Input() focusedOrder = new BehaviorSubject<Order | null>(null);
    @Input() orderCreate$ = new BehaviorSubject<Order | null>(null);
    @Input() orderUpdate$ = new BehaviorSubject<Order | null>(null);

    orderForm: Observable<FormGroup | null> | null = null;

    // constructor(private fb: FormBuilder, private orderClient: OrderClient) {}
    constructor(private fb: FormBuilder) { }


    ngOnChanges(): void {
        this.orderForm = this.focusedOrder.pipe(
            map(order => this.buildForm(order!)));
    }

    buildForm(order: Order | null): FormGroup {
        return this.fb.group({
            id: [order?.id ?? 0, Validators.required],
            customer: [order?.customer, Validators.required],
            orderNumber: [order?.orderNumber, Validators.required],
            // cuttingDate: [order?.cuttingDate],
            // preparationDate: [order?.preparationDate],
            // bendingDate: [order?.bendingDate],
            // assemblyDate: [order?.assemblyDate]
        });
    }

    onSubmit(orderForm: FormGroup) {
        if (!orderForm!.valid) {
            return;
        }

        const payload = Object.assign({}, orderForm!.getRawValue()) as Order;
        //   payload.cuttingDate = serializeDateOnly(payload.cuttingDate);
        //   payload.preparationDate = serializeDateOnly(payload.preparationDate);
        //   payload.bendingDate = serializeDateOnly(payload.bendingDate);
        //   payload.assemblyDate = serializeDateOnly(payload.assemblyDate);

        // if (payload.id) {
        //     this.orderClient
        //         .update(payload)
        //         .subscribe(() => this.orderUpdate$.next(payload));
        //     this.focusedOrder.next(null);
        //     return;
        // }

        // this.orderClient
        //     .createOrder(payload)
        //     .subscribe(() => this.orderCreate$.next(payload));
        // this.focusedOrder.next(null);
    }
}
