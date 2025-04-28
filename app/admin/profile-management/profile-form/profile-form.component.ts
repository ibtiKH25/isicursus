import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Profile {
  id: number;
  libelle: string;
}

@Component({
  selector: 'app-profile-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.css']
})
export class ProfileFormComponent implements OnInit {
  profileForm: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;
  isEditMode = false;
  profileId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.profileForm = this.fb.group({
      libelle: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.profileId = +params['id'];
        this.loadProfile(this.profileId);
      }
    });
  }

  loadProfile(id: number): void {
    this.http.get<Profile>(`http://localhost:8080/api/profiles/${id}`).subscribe({
      next: (profile) => {
        if (profile) {
          this.profileForm.setValue({
            libelle: profile.libelle
          });
        }
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement du profil';
        console.error('Error loading profile:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.isSubmitting = true;
      const profileData = this.profileForm.value;

      if (this.isEditMode && this.profileId) {
        this.http.put<Profile>(`http://localhost:8080/api/profiles/${this.profileId}`, profileData)
          .subscribe({
            next: () => {
              this.navigateToList();
            },
            error: (err) => {
              this.handleError(err);
            }
          });
      } else {
        this.http.post<Profile>('http://localhost:8080/api/profiles', profileData)
          .subscribe({
            next: () => {
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
    this.router.navigate(['/admin/profile-list']);
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