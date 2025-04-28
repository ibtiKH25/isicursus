import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  logoUrl = 'assets/images/logo.png';
  loginForm: FormGroup;
  selectedRole: string | null = null;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  selectRole(role: string): void {
    this.selectedRole = role;

    if (role === 'admin') {
      this.loginForm.patchValue({
        email: 'admin@gmail.com',
        password: 'shadhashadha'
      });
    } else {
      this.loginForm.reset();
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid && this.selectedRole) {
      console.log('Form submitted:', {
        ...this.loginForm.value,
        role: this.selectedRole
      });

      switch(this.selectedRole) {
        case 'admin':
          this.router.navigate(['/admin/dashboard']);
          break;
        case 'doctor':
          this.router.navigate(['/manager/statistics']);
          break;
        case 'patient':
          this.router.navigate(['/user/training/details']);
          break;
      }
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
