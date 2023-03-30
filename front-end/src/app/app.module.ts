import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExtraOptions, PreloadAllModules, RouterModule } from '@angular/router';
import { FuseModule } from '@fuse';
import { FuseConfigModule } from '@fuse/services/config';
import { FuseMockApiModule } from '@fuse/lib/mock-api';
import { CoreModule } from 'app/core/core.module';
import { appConfig } from 'app/core/config/app.config';
import { mockApiServices } from 'app/mock-api';
import { LayoutModule } from 'app/layout/layout.module';
import { AppComponent } from 'app/app.component';
import { appRoutes } from 'app/app.routing';
import { DxDataGridModule } from 'devextreme-angular';
import { environment } from 'environments/environment';

import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FlexModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { FullCalendarModule } from '@fullcalendar/angular';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { OrdersOdataInterceptor } from './modules/admin/views/order-list/orders-odata.interceptor';
import { ViewsModule } from './modules/admin/views/views.module';
import { TRANSLOCO_LOADER } from '@ngneat/transloco';
import { ApplicationTranslocoHttpLoader } from './application-transloco-http-loader.service';
import { API_BASE_URL } from './core/services/api.service';

const routerConfig: ExtraOptions = {
    preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'enabled'
};

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes, routerConfig),

        // Fuse, FuseConfig & FuseMockAPI
        FuseModule,
        FuseConfigModule.forRoot(appConfig),
        FuseMockApiModule.forRoot(mockApiServices),

        // Core module of your application
        CoreModule,

        // Layout module of your application
        LayoutModule,
        DxDataGridModule,

        // others application forRoor
        ViewsModule.forRoot(),

        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        NgxMatDatetimePickerModule,
        NgxMatNativeDateModule,
        MatFormFieldModule,
        FlexModule,
        MatCardModule,
        MatDialogModule,
        FullCalendarModule
    ],
    providers: [
        { provide: API_BASE_URL, useValue: environment.baseUrl },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: OrdersOdataInterceptor,
            multi: true
        },
        {
            provide: TRANSLOCO_LOADER,
            useClass: ApplicationTranslocoHttpLoader
        }
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}

