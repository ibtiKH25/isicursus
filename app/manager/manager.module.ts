import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ManagerRoutingModule } from './manager-routing.module';
import { ManagerLayoutComponent } from './layouts/manager-layout/manager-layout.component';
import { NavbarComponent } from '@shared/navbar/navbar.component';
import { SidebarComponent } from '@shared/sidebar/sidebar.component';
import { FooterComponent } from '@shared/footer/footer.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ManagerRoutingModule,
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    ManagerLayoutComponent
  ]
})
export class ManagerModule { }
