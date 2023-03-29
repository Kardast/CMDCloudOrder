import { Component, Inject } from "@angular/core";
import { FormGroup, Validators, FormBuilder, AbstractControlOptions, FormControl } from "@angular/forms";
import { DateAdapter } from "@angular/material/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { TranslocoService } from "@ngneat/transloco";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { Order, OrdersClient } from "app/common/clients/api.clients";
import { serializeDateOnly } from "app/shared/utils/dateonly.utils";
import { tap } from "rxjs";

@UntilDestroy()
@Component({
  templateUrl: './order-dialog.component.html',
  styleUrls: ['./order-dialog.component.scss'],
})
export class OrderDialogComponent {
  order: Order;
  form: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<OrderDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: OrderDialogData, 
    private ordersClient: OrdersClient, 
    private fb: FormBuilder,
    private translocoService: TranslocoService,
    private dateAdapter: DateAdapter<Date>) {
    this.order = data.order;
    this.form = this.fb.group({
      id: [this.order.id ?? 0],
      orderNumber: [this.order.orderNumber, Validators.required],
      customer: [this.order.customer, Validators.required],
      cuttingScheduledDate: [this.order.cuttingScheduledDate],
      preparationScheduledDate: [this.order.preparationScheduledDate],
      bendingScheduledDate: [this.order.bendingScheduledDate],
      assemblyScheduledDate: [this.order.assemblyScheduledDate],
      note: [this.order.note],
    }, { validators: this.dateGreaterThan } as AbstractControlOptions);
    
    this.translocoService.langChanges$
    .pipe(untilDestroyed(this))
    .subscribe(lang => {
      this.dateAdapter.setLocale(lang);
    });
  }

  save() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    if (!this.form.valid) {
      return;
    }

    const payload = Object.assign(this.order, this.form.value);
    payload.cuttingScheduledDate = serializeDateOnly(payload.cuttingScheduledDate);
    payload.preparationScheduledDate = serializeDateOnly(payload.preparationScheduledDate);
    payload.bendingScheduledDate = serializeDateOnly(payload.bendingScheduledDate);
    payload.assemblyScheduledDate = serializeDateOnly(payload.assemblyScheduledDate);
    this.ordersClient.upsert(payload)
      .pipe(
        tap(x => this.dialogRef.close(x)),
        untilDestroyed(this)
      )
      .subscribe();
  }

  abort() {
    this.dialogRef.close();
  }

  dateGreaterThan(group: FormControl): { [key: string]: any } {
    const value = group.getRawValue() as Order;
    let result = null;
    let prevDate = value.cuttingScheduledDate;
    if (value.preparationScheduledDate != null && prevDate != null && new Date(value.preparationScheduledDate) < new Date(prevDate)) {
      group.get('preparationScheduledDate').setErrors({ dateGreaterThan: true });
    }

    prevDate ??= value.preparationScheduledDate;
    if (value.bendingScheduledDate != null && prevDate != null && new Date(value.bendingScheduledDate) < new Date(prevDate)) {
      group.get('bendingScheduledDate').setErrors({ dateGreaterThan: true });
    }

    prevDate ??= value.bendingScheduledDate;
    if (value.assemblyScheduledDate != null && prevDate != null && new Date(value.assemblyScheduledDate) < new Date(prevDate)) {
      group.get('assemblyScheduledDate').setErrors({ dateGreaterThan: true });
    }

    return result;
  }
}

export class OrderDialogData {
  order: Order;
}
