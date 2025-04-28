import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();

  constructor(public router: Router) {}

  get currentRole(): string {
    const url = this.router.url;
    if (url.includes('admin')) return 'admin';
    if (url.includes('manager')) return 'manager';
    if (url.includes('user')) return 'user';
    return '';
  }
}
