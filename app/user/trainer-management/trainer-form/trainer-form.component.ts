import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Trainer {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  tel: number;
  type: 'interne' | 'externe';
  idEmployeur: number;
}

@Component({
  selector: 'app-trainer-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './trainer-form.component.html',
  styleUrls: ['./trainer-form.component.css']
})
export class TrainerFormComponent implements OnInit {
  trainerForm: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;
  isEditMode = false;
  trainerId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.trainerForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      tel: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      type: ['interne', Validators.required],
      idEmployeur: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.trainerId = +params['id'];
        this.loadTrainer(this.trainerId);
      }
    });
  }

  loadTrainer(id: number): void {
    this.http.get<Trainer>(`http://localhost:8080/api/trainers/${id}`).subscribe({
      next: (trainer) => {
        this.trainerForm.patchValue({
          nom: trainer.nom,
          prenom: trainer.prenom,
          email: trainer.email,
          tel: trainer.tel,
          type: trainer.type,
          idEmployeur: trainer.idEmployeur
        });
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement du trainer';
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    if (this.trainerForm.valid) {
      this.isSubmitting = true;
      const trainerData = this.trainerForm.value;

      if (this.isEditMode && this.trainerId) {
        this.http.put(`http://localhost:8080/api/trainers/${this.trainerId}`, {
          ...trainerData,
          id: this.trainerId
        }).subscribe({
          next: () => this.navigateToList(),
          error: (err) => this.handleError(err)
        });
      } else {
        this.http.post('http://localhost:8080/api/trainers', trainerData).subscribe({
          next: () => this.navigateToList(),
          error: (err) => this.handleError(err)
        });
      }
    }
  }

  navigateToList(): void {
    this.router.navigate(['/admin/trainer-list']);
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