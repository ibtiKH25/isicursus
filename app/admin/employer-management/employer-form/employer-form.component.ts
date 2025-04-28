import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Employeur {
  id: number;
  nomEmployeur: string;
}

@Component({
  selector: 'app-employeur-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employer-form.component.html',
  styleUrls: ['./employer-form.component.css']
})
export class EmployeurFormComponent implements OnInit {
  employeurForm: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;
  isEditMode = false;
  employeurId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.employeurForm = this.fb.group({
      nomEmployeur: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.employeurId = +params['id'];
        this.loadEmployeur(this.employeurId);
      }
    });
  }

  loadEmployeur(id: number): void {
    this.http.get<Employeur>(`http://localhost:8080/api/employeurs/${id}`).subscribe({
        next: (employeur) => {
            if (employeur) {
                this.employeurForm.setValue({
                    nomEmployeur: employeur.nomEmployeur
                });
            }
        },
        error: (err) => {
            this.errorMessage = 'Error loading employer';
            console.error('Error loading employer:', err);
        }
    });
}
onSubmit(): void {
  if (this.employeurForm.valid) {
      this.isSubmitting = true;
      const employeurData = this.employeurForm.value;

      if (this.isEditMode && this.employeurId) {
        
          const updateData = { ...employeurData, id: this.employeurId };
          this.http.put<Employeur>(`http://localhost:8080/api/employeurs/${this.employeurId}`, updateData)
              .subscribe({
                  next: (updatedEmployeur) => {
                      console.log('Employer updated:', updatedEmployeur);
                      this.navigateToList();
                  },
                  error: (err) => {
                      console.error('Update error:', err);
                      this.handleError(err);
                  }
              });
      } else {
          this.http.post<Employeur>('http://localhost:8080/api/employeurs', employeurData)
              .subscribe({
                  next: (createdEmployeur) => {
                      console.log('Employer created:', createdEmployeur);
                      this.navigateToList();
                  },
                  error: (err) => {
                      console.error('Create error:', err);
                      this.handleError(err);
                  }
              });
      }
  }
}

  navigateToList(): void {
    this.router.navigate(['/admin/employeur-list']);
  }

  handleError(error: any): void {
    this.isSubmitting = false;
    this.errorMessage = 'An error occurred. Please try again.';
    console.error(error);
  }

  onCancel(): void {
    this.navigateToList();
  }
}
