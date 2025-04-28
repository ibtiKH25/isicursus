import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatisticsDashboardComponent } from './statistics-dashboard/statistics-dashboard.component';
import { ManagerLayoutComponent } from './layouts/manager-layout/manager-layout.component';

const routes: Routes = [
  {
    path: '',
    component: ManagerLayoutComponent,
    children: [
      { path: 'statistics', component: StatisticsDashboardComponent },
      { path: '', redirectTo: 'statistics', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerRoutingModule { }
