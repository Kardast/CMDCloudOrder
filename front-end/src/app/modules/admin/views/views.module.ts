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
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { OrderFormComponent } from './order-list/order-form/order-form.component';
import {MAT_DATE_LOCALE} from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { environment } from 'environments/environment';
import { API_BASE_URL } from 'app/core/services/api.service';
import {MatPaginatorModule} from '@angular/material/paginator';


@NgModule({
    declarations: [
        OrderListComponent,
        OrdersCalendarComponent,
        OrderFormComponent
    ],
    exports: [
        OrderListComponent,
        OrdersCalendarComponent,
        OrderFormComponent
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
        MatIconModule,
        MatTableModule,
        FormsModule,
        MatPaginatorModule
    ],
})
export class ViewsModule {
    static forRoot(): ModuleWithProviders<ViewsModule> {
        return {
            ngModule: ViewsModule,
            providers: [
                { provide: API_BASE_URL, useValue: environment.baseUrl },
                OrdersStoreService,
                { provide: MAT_DATE_LOCALE, useValue: 'af' },
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: OrdersOdataInterceptor,
                    multi: true
                },
            ]
        };
    }
}
