import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface User {
  id: number;
  login: string;
  password: string;
  idRole: number;
}

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;
  isEditMode = false;
  userId: number | null = null;
  
  // Rôles prédéfinis
  roles = [
    { id: 1, nom: 'simple utilisateur' },
    { id: 2, nom: 'responsable' },
    { id: 3, nom: 'administrateur' }
  ];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userForm = this.fb.group({
      login: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      idRole: ['', [Validators.required, Validators.pattern(/^[1-3]$/)]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.userId = +params['id'];
        this.loadUser(this.userId);
      }
    });
  }

  loadUser(id: number): void {
    this.http.get<User>(`http://localhost:8080/api/users/${id}`).subscribe({
      next: (user) => {
        if (user) {
          this.userForm.patchValue({
            login: user.login,
            idRole: user.idRole
          });
        }
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement de l\'utilisateur';
        console.error('Error loading user:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.isSubmitting = true;
      const userData = this.userForm.value;

      if (this.isEditMode && this.userId) {
        const updateData = { ...userData, id: this.userId };
        this.http.put<User>(`http://localhost:8080/api/users/${this.userId}`, updateData)
          .subscribe({
            next: (updatedUser) => {
              this.navigateToList();
            },
            error: (err) => {
              this.handleError(err);
            }
          });
      } else {
        this.http.post<User>('http://localhost:8080/api/users', userData)
          .subscribe({
            next: (createdUser) => {
              this.navigateToList();
            },
            error: (err) => {
              this.handleError(err);
            }
          });
      }
    }
  }

  navigateToList(): void {
    this.router.navigate(['/admin/user-list']);
  }

  handleError(error: any): void {
    this.isSubmitting = false;
    this.errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
    console.error(error);
  }

  onCancel(): void {
    this.navigateToList();
  }
}