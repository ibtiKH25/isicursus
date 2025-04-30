import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmployeurFormComponent } from './employer-management/employer-form/employer-form.component';
import { EmployeurListComponent } from './employer-management/employer-list/employer-list.component';
import { DomainListComponent } from './domain-management/domain-list/domain-list.component';
import { DomainFormComponent } from './domain-management/domain-form/domain-form.component';
import { UserFormComponent } from './user-management/user-form/user-form.component';
import { UserListComponent } from './user-management/user-list/user-list.component';
import { ProfileListComponent } from './profile-management/profile-list/profile-list.component';
import { ProfileFormComponent } from './profile-management/profile-form/profile-form.component';
import { TrainerFormComponent } from '../user/trainer-management/trainer-form/trainer-form.component';
import { TrainerListComponent } from '../user/trainer-management/trainer-list/trainer-list.component';
import { TrainingFormComponent } from '../user/training-management/training-form/training-form.component';
import { TrainingListComponent } from '../user/training-management/training-list/training-list.component';
import { TrainingDetailsComponent } from '../user/training-management/training-details/training-details.component';
import { StructureFormComponent } from './structure-management/structure-form/structure-form.component';
import { StructureListComponent } from './structure-management/structure-list/structure-list.component';


const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'employeur-form', component: EmployeurFormComponent },
      { path: 'employeur-list', component: EmployeurListComponent },
      { path: 'employeur-form/:id', component: EmployeurFormComponent },
      { path: 'domain-list', component: DomainListComponent },
      { path: 'domain-form', component: DomainFormComponent },
      { path: 'user-form', component: UserFormComponent },
      { path: 'user-list', component: UserListComponent },
      { path: 'profile-list', component: ProfileListComponent },
      { path: 'profile-form', component: ProfileFormComponent },
      { path: 'training-form', component: TrainingFormComponent },
      { path: 'training-list', component: TrainingListComponent},
      { path: 'Training-details', component: TrainingDetailsComponent },
      { path: 'structure-form', component:StructureFormComponent },
      { path: 'structure-list', component:StructureListComponent },
    ]
    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
