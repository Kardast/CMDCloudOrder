import { NgModule } from '@angular/core';
import { DxDataGridModule, DxTreeListModule } from 'devextreme-angular';
import { TranslocoCoreModule } from 'app/core/transloco/transloco.module';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { MatCardModule } from '@angular/material/card';
import { OrderDialogComponent } from './order-dialog/order-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { OrderCalendarEventDialogComponent } from './order-calendar-event-dialog/order-calendar-event-dialog.component';
import { MatDividerModule } from '@angular/material/divider';
import { CustomDateAdapter } from 'app/shared/custom-date.adapter';

@NgModule({
    declarations: [
        OrderDialogComponent,
        ConfirmDialogComponent,
        OrderCalendarEventDialogComponent
      ],
      exports: [
        OrderDialogComponent,
        ConfirmDialogComponent,
        OrderCalendarEventDialogComponent
    ],
    imports: [
        CommonModule,
        DxTreeListModule,
        DxDataGridModule,
        TranslocoCoreModule,
        ReactiveFormsModule,
        
        MatInputModule, 
        MatDatepickerModule,
        MatButtonModule,
        MatNativeDateModule,
        NgxMatDatetimePickerModule,
        NgxMatNativeDateModule,
        MatFormFieldModule,
        MatCardModule,
        MatDialogModule,
        MatDividerModule        
    ],
    providers: [
      { provide: DateAdapter, useClass: CustomDateAdapter }
    ]
})
export class DialogsModule
{
}
