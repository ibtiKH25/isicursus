// user.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';

// Training components
import { TrainingDetailsComponent } from './training-management/training-details/training-details.component';
import { TrainingListComponent } from './training-management/training-list/training-list.component';
import { TrainingFormComponent } from './training-management/training-form/training-form.component';

// Trainer components
import { TrainerListComponent } from './trainer-management/trainer-list/trainer-list.component';
import { TrainerFormComponent } from './trainer-management/trainer-form/trainer-form.component';

// Participant components
import { ParticipantListComponent } from './participant-management/participant-list/participant-list.component';
import { ParticipantFormComponent } from './participant-management/participant-form/participant-form.component';

// Shared components
import { NavbarComponent } from '@shared/navbar/navbar.component';
import { SidebarComponent } from '@shared/sidebar/sidebar.component';
import { FooterComponent } from '@shared/footer/footer.component';

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    UserLayoutComponent,

    // Shared components
    NavbarComponent,
    SidebarComponent,
    FooterComponent,

    // Training components
    TrainingDetailsComponent,
    TrainingListComponent,
    TrainingFormComponent,

    // Trainer components
    TrainerListComponent,
    TrainerFormComponent,

    // Participant components
    ParticipantListComponent,
    ParticipantFormComponent
  ]
})
export class UserModule { }
