import { ModuleWithProviders, NgModule } from '@angular/core';
import { OrderListComponent } from 'app/modules/admin/views/order-list/order-list.component';
import { DxDataGridModule, DxTreeListModule } from 'devextreme-angular';
import { TranslocoCoreModule } from 'app/core/transloco/transloco.module';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { MatCardModule } from '@angular/material/card';
import { DialogsModule } from '../dialogs/dialogs.module';
import { OrdersCalendarComponent } from './orders-calendar/orders-calendar.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { OrdersStoreService } from './order-list/orders.store.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { OrdersOdataInterceptor } from './order-list/orders-odata.interceptor';

@NgModule({
  declarations: [
    OrderListComponent,
    OrdersCalendarComponent
  ],
  exports: [
    OrderListComponent,
    OrdersCalendarComponent
  ],
  imports: [
    CommonModule,
    DxTreeListModule,
    DxDataGridModule,
    TranslocoCoreModule,
    MatButtonModule,
    ReactiveFormsModule,
    DialogsModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    MatFormFieldModule,
    MatCardModule,
    FullCalendarModule,
  ],
})
export class ViewsModule {
  static forRoot(): ModuleWithProviders<ViewsModule> {
    return {
      ngModule: ViewsModule,
      providers: [
        OrdersStoreService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: OrdersOdataInterceptor,
          multi: true
        }
      ]
    };
  }
}
