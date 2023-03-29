import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CuttingComponent } from './cutting.component';
import { Route, RouterModule } from '@angular/router';
import { ViewsModule } from "../../views/views.module";

const cuttingPanelRoutes: Route[] = [
    {
        path     : '',
        component: CuttingComponent
    }
];

@NgModule({
    declarations: [
        CuttingComponent
    ],
    imports: [
        RouterModule.forChild(cuttingPanelRoutes),
        CommonModule,
        ViewsModule
    ]
})
export class CuttingModule { }
