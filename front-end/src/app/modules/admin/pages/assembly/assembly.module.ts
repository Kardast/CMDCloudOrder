import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssemblyComponent } from './assembly.component';
import { Route, RouterModule } from '@angular/router';
import { ViewsModule } from "../../views/views.module";

const cuttingPanelRoutes: Route[] = [
    {
        path     : '',
        component: AssemblyComponent
    }
];

@NgModule({
    declarations: [
      AssemblyComponent
    ],
    imports: [
        RouterModule.forChild(cuttingPanelRoutes),
        CommonModule,
        ViewsModule
    ]
})
export class AssemblyModule { }
