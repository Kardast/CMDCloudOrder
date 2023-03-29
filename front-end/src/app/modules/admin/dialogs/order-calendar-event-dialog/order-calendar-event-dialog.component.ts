import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControlOptions, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Order } from 'app/common/clients/api.clients';
import { tap } from 'rxjs';
import { OrderDialogComponent } from '../order-dialog/order-dialog.component';
import { OrdersClient } from 'app/common/clients/api.clients'
import { isOrderStageStarted, isOrderStageEnded, isOrderStageInProcess, setOrderStageStartDate, setOrderStageEndDate } from 'app/shared/utils/order.utils';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-order-calendar-event-dialog',
  templateUrl: './order-calendar-event-dialog.component.html',
  styleUrls: ['./order-calendar-event-dialog.component.scss']
})
export class OrderCalendarEventDialogComponent {
  durationHours: number;
  durationMinutes: number;
  form: FormGroup;
  noteForm: FormGroup;

  constructor(private dialogRef: MatDialogRef<OrderDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: OrderCalendarEventDialogData, private ordersClient: OrdersClient, private fb: FormBuilder) {
    this.form = this.fb.group({
      durationHours: [this.durationHours, [Validators.required, Validators.min(0)]],
      durationMinutes: [this.durationMinutes, [Validators.required, Validators.min(0), Validators.max(59)]]
    });
    this.noteForm = this.fb.group({
      note: this.data.order.note,
    });
  }

  get isOrderStageStarted(): boolean {
    return isOrderStageStarted(this.data.order, this.data.stage);
  }

  get isOrderStageEnded(): boolean {
    return isOrderStageEnded(this.data.order, this.data.stage);
  }

  get isOrderStageInProcess(): boolean {
    return isOrderStageInProcess(this.data.order, this.data.stage);
  }

  close() {
    this.dialogRef.close();
  }

  start() {
    const payload = structuredClone(this.data.order);
    setOrderStageStartDate(payload, this.data.stage, new Date()); // now

    this.ordersClient.upsert(payload)
      .pipe(
        tap(() => this.dialogRef.close(payload)),
        untilDestroyed(this)
      )
      .subscribe();
  }

  finish() {
    const payload = structuredClone(this.data.order);
    setOrderStageEndDate(payload, this.data.stage, new Date()); // now

    this.ordersClient.upsert(payload)
      .pipe(
        tap(() => this.dialogRef.close(payload)),
        untilDestroyed(this)
      )
      .subscribe();
  }

  finishFromDuration() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    if (!this.form.valid) {
      return;
    }

    const payload = structuredClone(this.data.order);
    setOrderStageEndDate(payload, this.data.stage, new Date()); // now

    let orderStageStartDate = new Date(); // now
    orderStageStartDate.setHours(orderStageStartDate.getHours() - this.form.controls['durationHours'].value);
    orderStageStartDate.setMinutes(orderStageStartDate.getMinutes() - this.form.controls['durationMinutes'].value);
    setOrderStageStartDate(payload, this.data.stage, orderStageStartDate);

    this.ordersClient.upsert(payload)
      .pipe(
        tap(() => this.dialogRef.close(payload)),
        untilDestroyed(this)
      )
      .subscribe();
  }

  saveNote() {
    this.noteForm.markAllAsTouched();
    this.noteForm.updateValueAndValidity();

    if (!this.noteForm.valid) {
      return;
    }

    const payload = Object.assign(this.data.order, this.noteForm.value);

    this.ordersClient.upsert(payload)
      .pipe(untilDestroyed(this))
      .subscribe();
  }
}

export class OrderCalendarEventDialogData {
  order: Order;
  stage: 'cutting' | 'preparation' | 'bending' | 'assembly';
}
