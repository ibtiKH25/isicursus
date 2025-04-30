import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Structure {
  id: number;
  libelle: string;
}

@Component({
  selector: 'app-structure-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './structure-form.component.html',
  styleUrls: ['./structure-form.component.css']
})
export class StructureFormComponent implements OnInit {
  structureForm: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;
  isEditMode = false;
  structureId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.structureForm = this.fb.group({
      libelle: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.structureId = +params['id'];
        this.loadStructure(this.structureId);
      }
    });
  }

  loadStructure(id: number): void {
    this.http.get<Structure>(`http://localhost:8080/api/structures/${id}`).subscribe({
      next: (structure) => {
        if (structure) {
          this.structureForm.patchValue({
            libelle: structure.libelle
          });
        }
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement de la structure';
        console.error('Error loading structure:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.structureForm.valid) {
      this.isSubmitting = true;
      const structureData = this.structureForm.value;

      if (this.isEditMode && this.structureId) {
        this.http.put<Structure>(`http://localhost:8080/api/structures/${this.structureId}`, structureData)
          .subscribe({
            next: () => this.navigateToList(),
            error: (err) => this.handleError(err)
          });
      } else {
        this.http.post<Structure>('http://localhost:8080/api/structures', structureData)
          .subscribe({
            next: () => this.navigateToList(),
            error: (err) => this.handleError(err)
          });
      }
    }
  }

  navigateToList(): void {
    this.router.navigate(['/admin/structure-list']);
  }

  handleError(error: any): void {
    this.isSubmitting = false;
    this.errorMessage = error.error?.message || 'Une erreur est survenue';
    console.error(error);
  }

  onCancel(): void {
    this.navigateToList();
  }
}