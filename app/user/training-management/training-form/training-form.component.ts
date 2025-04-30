import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Domain {
  id: number;
  libelle: string;
}

interface Training {
  id: number;
  titre: string;
  annee: number;
  duree: number;
  idDomaine: number;
  budget: number;
  domaine?: Domain; // Ajouté pour afficher le libellé du domaine
}

@Component({
  selector: 'app-training-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './training-form.component.html',
  styleUrls: ['./training-form.component.css']
})
export class TrainingFormComponent implements OnInit {
  trainingForm: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;
  isEditMode = false;
  trainingId: number | null = null;
  domains: Domain[] = [];
  isLoadingDomains = true; // Nouveau: indicateur de chargement

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.trainingForm = this.fb.group({
      titre: ['', [Validators.required, Validators.minLength(3)]],
      annee: ['', [Validators.required, Validators.min(2020), Validators.max(2030)]],
      duree: ['', [Validators.required, Validators.min(1)]],
      idDomaine: ['', Validators.required],
      budget: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadDomains();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.trainingId = +params['id'];
        this.loadTraining(this.trainingId);
      }
    });
  }

  loadDomains(): void {
    this.isLoadingDomains = true;
    this.http.get<Domain[]>('http://localhost:8080/api/domaines').subscribe({
      next: (domains) => {
        this.domains = domains;
        this.isLoadingDomains = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des domaines:', err);
        this.errorMessage = 'Impossible de charger la liste des domaines';
        this.isLoadingDomains = false;
      }
    });
  }

  loadTraining(id: number): void {
    this.http.get<Training>(`http://localhost:8080/api/trainings/${id}`).subscribe({
      next: (training) => {
        if (training) {
          this.trainingForm.patchValue({
            titre: training.titre,
            annee: training.annee,
            duree: training.duree,
            idDomaine: training.idDomaine,
            budget: training.budget
          });
        }
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement de la formation';
        console.error('Error loading training:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.trainingForm.valid && !this.isLoadingDomains) {
      this.isSubmitting = true;
      const trainingData = this.trainingForm.value;

      if (this.isEditMode && this.trainingId) {
        this.http.put<Training>(`http://localhost:8080/api/trainings/${this.trainingId}`, trainingData)
          .subscribe({
            next: () => {
              this.navigateToList();
            },
            error: (err) => {
              this.handleError(err);
            }
          });
      } else {
        this.http.post<Training>('http://localhost:8080/api/trainings', trainingData)
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
    this.router.navigate(['/admin/training-list']);
  }

  handleError(error: any): void {
    this.isSubmitting = false;
    this.errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
    console.error(error);
  }

  onCancel(): void {
    this.navigateToList();
  }

  // Nouvelle méthode pour obtenir le libellé du domaine sélectionné
  getSelectedDomainLabel(): string {
    const id = this.trainingForm.get('idDomaine')?.value;
    const domain = this.domains.find(d => d.id === id);
    return domain ? domain.libelle : '';
  }
}