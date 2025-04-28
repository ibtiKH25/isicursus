import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  selector: 'app-trainer-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trainer-list.component.html',
  styleUrls: ['./trainer-list.component.css']
})
export class TrainerListComponent implements OnInit {
  trainers: Trainer[] = [];
  filteredTrainers: Trainer[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  searchTerm: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  currentPage: number = 1;
  itemsPerPage: number = 5;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTrainers();
  }

  loadTrainers(): void {
    this.isLoading = true;
    this.http.get<Trainer[]>('http://localhost:8080/api/trainers').subscribe({
      next: (data) => {
        this.trainers = data;
        this.filteredTrainers = [...data];
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des trainers';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  applyFilters(): void {
    let result = this.trainers;
    
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(t =>
        t.nom.toLowerCase().includes(term) ||
        t.prenom.toLowerCase().includes(term) ||
        t.email.toLowerCase().includes(term)
      );
    }

    result = [...result].sort((a, b) => {
      const nameA = `${a.nom} ${a.prenom}`.toLowerCase();
      const nameB = `${b.nom} ${b.prenom}`.toLowerCase();
      return this.sortDirection === 'asc' 
        ? nameA.localeCompare(nameB) 
        : nameB.localeCompare(nameA);
    });

    this.filteredTrainers = result;
    this.currentPage = 1;
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  toggleSort(): void {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.applyFilters();
  }

  get paginatedTrainers(): Trainer[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredTrainers.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredTrainers.length / this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  openAddForm(): void {
    this.router.navigate(['/admin/trainer-form']);
  }

  openEditForm(trainer: Trainer): void {
    this.router.navigate(['/admin/trainer-form', trainer.id]);
  }

  deleteTrainer(trainer: Trainer): void {
    if (confirm('Voulez-vous vraiment supprimer ce trainer ?')) {
      this.http.delete(`http://localhost:8080/api/trainers/${trainer.id}`).subscribe({
        next: () => {
          this.trainers = this.trainers.filter(t => t.id !== trainer.id);
          this.applyFilters();
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de la suppression';
          console.error(err);
        }
      });
    }
  }
}