import { Component ,Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
  constructor(private router: Router) {}
  @Input() role: 'admin' | 'manager' | 'user' = 'admin';
  get currentRole(): string {
    const url = this.router.url;
    if (url.includes('admin')) return 'admin';
    if (url.includes('manager')) return 'manager';
    if (url.includes('user')) return 'user';
    return '';
  }

  navigateTo(route: string): void {
    this.router.navigate([`/${this.currentRole}/${route}`]);
  }
}
