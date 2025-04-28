import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Formateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  tel: number;
  type: 'interne' | 'externe';
  idEmployeur: number;
}

@Component({
  selector: 'app-formateur-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formateur-list.component.html',
  styleUrls: ['./formateur-list.component.css']
})
export class FormateurListComponent implements OnInit {
  formateurs: Formateur[] = [];
  filteredFormateurs: Formateur[] = [];
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
    this.loadFormateurs();
  }

  loadFormateurs(): void {
    this.isLoading = true;
    this.http.get<Formateur[]>('http://localhost:8080/api/formateurs').subscribe({
      next: (data) => {
        this.formateurs = data;
        this.filteredFormateurs = [...data];
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des formateurs';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  applyFilters(): void {
    let result = this.formateurs;
    
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(f =>
        f.nom.toLowerCase().includes(term) ||
        f.prenom.toLowerCase().includes(term) ||
        f.email.toLowerCase().includes(term)
    )}

    result = [...result].sort((a, b) => {
      const nameA = `${a.nom} ${a.prenom}`.toLowerCase();
      const nameB = `${b.nom} ${b.prenom}`.toLowerCase();
      return this.sortDirection === 'asc' 
        ? nameA.localeCompare(nameB) 
        : nameB.localeCompare(nameA);
    });

    this.filteredFormateurs = result;
    this.currentPage = 1;
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  toggleSort(): void {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.applyFilters();
  }

  get paginatedFormateurs(): Formateur[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredFormateurs.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredFormateurs.length / this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  openAddForm(): void {
    this.router.navigate(['/admin/formateur-form']);
  }

  openEditForm(formateur: Formateur): void {
    this.router.navigate(['/admin/formateur-form', formateur.id]);
  }

  deleteFormateur(formateur: Formateur): void {
    if (confirm('Voulez-vous vraiment supprimer ce formateur ?')) {
      this.http.delete(`http://localhost:8080/api/formateurs/${formateur.id}`).subscribe({
        next: () => {
          this.formateurs = this.formateurs.filter(f => f.id !== formateur.id);
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