import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Training {
  id: number;
  titre: string;
  annee: number;
  duree: number;
  idDomaine: number;
  budget: number;
  domaine?: {
    libelle: string;
  };
}

@Component({
  selector: 'app-training-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './training-details.component.html',
  styleUrls: ['./training-details.component.css']
})
export class TrainingDetailsComponent implements OnInit {
  training: Training | null = null;
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.loadTraining(id);
  }

  loadTraining(id: number): void {
    this.http.get<Training>(`http://localhost:8080/api/trainings/${id}`).subscribe({
      next: (training) => {
        this.training = training;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement de la formation';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  editTraining(): void {
    if (this.training) {
      this.router.navigate(['/admin/training-form', this.training.id]);
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/training-list']);
  }
}