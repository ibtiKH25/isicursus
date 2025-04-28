import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

interface Domaine {
  id: number;
  libelle: string;
}

@Component({
  selector: 'app-domain-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './domain-form.component.html',
  styleUrls: ['./domain-form.component.css']
})
export class DomainFormComponent implements OnInit {
  domaineForm: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;
  isEditMode = false;
  domaineId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.domaineForm = this.fb.group({
      libelle: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    this.loadallDomaine();
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.domaineId = +params['id'];
        this.loadDomaine(this.domaineId);
      }
    });
  }

  loadDomaine(id: number): void {
    this.http.get<Domaine>(`http://localhost:8080/api/domaines/${id}`).subscribe({
      next: (domaine) => {
        if (domaine) {
          this.domaineForm.patchValue({
            libelle: domaine.libelle
          });
        }
      },
      error: (err) => {
        console.error('Erreur chargement:', err);
        this.errorMessage = 'Erreur lors du chargement';
      }
    });
  }
  loadallDomaine( ): void {
    this.http.get<Domaine>(`http://localhost:8080/api/domaines`).subscribe({
      next: (domaine) => {
       console.log("recieved data"+domaine)
      },
      error: (err) => {
        console.error('Erreur chargement:', err);
        this.errorMessage = 'Erreur lors du chargement';
      }
    });
  }


  onSubmit(): void {
    if (this.domaineForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.errorMessage = null;
      
      const domaineData = this.domaineForm.value;
      const observable = this.isEditMode && this.domaineId
        ? this.http.put(`http://localhost:8080/api/domaines/${this.domaineId}`, { ...domaineData, id: this.domaineId })
        : this.http.post('http://localhost:8080/api/domaines', domaineData);

      observable.subscribe({
        next: () => {
          this.router.navigate(['/admin/domain-list']);
        },
        error: (err) => {
          console.error('Erreur soumission:', err);
          this.errorMessage = err.error?.message || 'Erreur lors de la sauvegarde';
          this.isSubmitting = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/domain-list']);
  }
}