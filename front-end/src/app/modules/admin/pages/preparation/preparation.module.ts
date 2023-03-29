import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreparationComponent } from './preparation.component';
import { Route, RouterModule } from '@angular/router';
import { ViewsModule } from "../../views/views.module";

const cuttingPanelRoutes: Route[] = [
    {
        path     : '',
        component: PreparationComponent
    }
];

@NgModule({
    declarations: [
        PreparationComponent
    ],
    imports: [
        RouterModule.forChild(cuttingPanelRoutes),
        CommonModule,
        ViewsModule
    ]
})
export class PreparationModule { }
