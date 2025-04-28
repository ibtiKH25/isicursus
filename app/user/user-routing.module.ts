import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { TrainingDetailsComponent } from './training-management/training-details/training-details.component';
import { TrainingListComponent } from './training-management/training-list/training-list.component';
import { TrainingFormComponent } from './training-management/training-form/training-form.component';
import { TrainerListComponent } from './trainer-management/trainer-list/trainer-list.component';
import { TrainerFormComponent } from './trainer-management/trainer-form/trainer-form.component';
import { ParticipantListComponent } from './participant-management/participant-list/participant-list.component';
import { ParticipantFormComponent } from './participant-management/participant-form/participant-form.component';

const routes: Routes = [
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      // Training routes
      {
        path: 'training',
        children: [
          { path: 'details', component: TrainingDetailsComponent },
          { path: '', redirectTo: 'details', pathMatch: 'full' }
        ]
      },
      {
        path: 'trainings',
        children: [
          { path: '', component: TrainingListComponent },
          { path: 'add', component: TrainingFormComponent },
          { path: 'edit/:id', component: TrainingFormComponent },
          { path: ':id', component: TrainingDetailsComponent }
        ]
      },
      // Trainer routes
      { path: 'trainers', component: TrainerListComponent },
      { path: 'trainers/add', component: TrainerFormComponent },
      { path: 'trainers/edit/:id', component: TrainerFormComponent },
      { path: 'trainer-form', component: TrainerFormComponent },
      { path: 'trainer-list', component: TrainerListComponent },
      // Participant routes
      { path: 'participant-list', component: ParticipantListComponent },
      { path: 'participant-form', component: ParticipantFormComponent },
      { path: 'user/participant-form/:id', component: ParticipantFormComponent},
      { path: 'participants/add', component: ParticipantFormComponent },
      { path: 'participants/edit/:id', component: ParticipantFormComponent },
      // Default redirect
      { path: '', redirectTo: 'trainings', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
