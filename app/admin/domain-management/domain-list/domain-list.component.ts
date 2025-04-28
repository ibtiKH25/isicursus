import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Domaine {
  id: number;
  libelle: string;
}

@Component({
  selector: 'app-domain-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './domain-list.component.html',
  styleUrls: ['./domain-list.component.css']
})
export class DomainListComponent implements OnInit {
  domaines: Domaine[] = [];
  filteredDomaines: Domaine[] = [];
  paginatedDomaines: Domaine[] = [];
  isLoading: boolean = false;
  searchTerm: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadDomaines();
  }

  loadDomaines(): void {
    this.isLoading = true;
    this.http.get<Domaine[]>('http://localhost:8080/domaines').subscribe({
      next: (data) => {
        this.domaines = data;
        this.filteredDomaines = [...data];
        this.updatePagination();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur API:', err);
        this.isLoading = false;
      }
    });
  }

  onSearchChange(): void {
    if (!this.searchTerm) {
      this.filteredDomaines = [...this.domaines];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredDomaines = this.domaines.filter(domaine => 
        domaine.libelle.toLowerCase().includes(term)
      );
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  toggleSort(): void {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.filteredDomaines.sort((a, b) => {
      const compare = a.libelle.localeCompare(b.libelle);
      return this.sortDirection === 'asc' ? compare : -compare;
    });
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredDomaines.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedDomaines = this.filteredDomaines.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  deleteDomaine(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce domaine ?')) {
      this.http.delete(`http://localhost:8080/domaines/${id}`).subscribe({
        next: () => this.loadDomaines(),
        error: (err) => console.error('Erreur suppression:', err)
      });
    }
  }

  openAddForm(): void {
    this.router.navigate(['/admin/domain-form']);
  }

  openEditForm(id: number): void {
    this.router.navigate([`/admin/domain-form/${id}`]);
  }
}