import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BendingComponent } from './bending.component';
import { Route, RouterModule } from '@angular/router';
import { ViewsModule } from "../../views/views.module";

const cuttingPanelRoutes: Route[] = [
    {
        path     : '',
        component: BendingComponent
    }
];

@NgModule({
    declarations: [
        BendingComponent
    ],
    imports: [
        RouterModule.forChild(cuttingPanelRoutes),
        CommonModule,
        ViewsModule
    ]
})
export class BendingModule { }
