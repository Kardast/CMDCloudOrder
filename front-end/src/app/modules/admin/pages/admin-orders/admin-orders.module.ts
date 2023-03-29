import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AdminOrdersComponent } from 'app/modules/admin/pages/admin-orders/admin-orders.component';
import { ViewsModule } from "../../views/views.module";

const adminOrdersRoutes: Route[] = [
    {
        path     : '',
        component: AdminOrdersComponent
    }
];

@NgModule({
    declarations: [
        AdminOrdersComponent
    ],
    imports: [
        RouterModule.forChild(adminOrdersRoutes),
        ViewsModule
    ]
})
export class AdminOrdersModule
{
}
