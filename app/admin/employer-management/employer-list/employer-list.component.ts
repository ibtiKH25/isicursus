import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Employeur {
  id: number;
  nomEmployeur: string;
}

@Component({
  selector: 'app-employeur-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employer-list.component.html',
  styleUrls: ['./employer-list.component.css']
})
export class EmployeurListComponent implements OnInit {
  employeurs: Employeur[] = [];
  filteredEmployeurs: Employeur[] = [];
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
    this.loadEmployeurs();
  }

  loadEmployeurs(): void {
    this.isLoading = true;
    this.http.get<Employeur[]>('http://localhost:8080/api/employeurs').subscribe({
      next: (data) => {
        this.employeurs = data;
        this.filteredEmployeurs = [...data];
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error loading employers';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  applyFilters(): void {
    // Apply search filter
    let result = this.employeurs;
    if (this.searchTerm) {
      result = result.filter(e =>
        e.nomEmployeur.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Apply sort
    result = [...result].sort((a, b) => {
      const nameA = a.nomEmployeur.toLowerCase();
      const nameB = b.nomEmployeur.toLowerCase();
      return this.sortDirection === 'asc'
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });

    this.filteredEmployeurs = result;
    this.currentPage = 1; // Reset to first page when filters change
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  toggleSort(): void {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.applyFilters();
  }

  get paginatedEmployeurs(): Employeur[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredEmployeurs.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredEmployeurs.length / this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  openAddForm(): void {
    this.router.navigate(['/admin/employeur-form']);
  }

  openEditForm(employeur: Employeur): void {
    this.router.navigate(['/admin/employeur-form', employeur.id]);
  }

  deleteEmployeur(employeur: Employeur): void {
    if (confirm('Are you sure you want to delete this employer?')) {
      this.http.delete(`http://localhost:8080/api/employeurs/${employeur.id}`).subscribe({
        next: () => {
          this.employeurs = this.employeurs.filter(e => e.id !== employeur.id);
          this.applyFilters(); // Refresh filtered list
        },
        error: (err) => {
          this.errorMessage = 'Error deleting employer';
          console.error(err);
        }
      });
    }
  }
}
