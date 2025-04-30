import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Structure {
  id: number;
  libelle: string;
}

@Component({
  selector: 'app-structure-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './structure-list.component.html',
  styleUrls: ['./structure-list.component.css']
})
export class StructureListComponent implements OnInit {
  structures: Structure[] = [];
  filteredStructures: Structure[] = [];
  isLoading = true;
  errorMessage = '';
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 5;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStructures();
  }

  loadStructures(): void {
    this.http.get<Structure[]>('http://localhost:8080/api/structures').subscribe({
      next: (data) => {
        this.structures = data;
        this.filteredStructures = [...data];
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des structures';
        this.isLoading = false;
      }
    });
  }

  applySearch(): void {
    this.filteredStructures = this.structures.filter(s =>
      s.libelle.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.currentPage = 1;
  }

  get paginatedStructures(): Structure[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredStructures.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredStructures.length / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  addStructure(): void {
    this.router.navigate(['/admin/structure-form']);
  }

  editStructure(structure: Structure): void {
    this.router.navigate(['/admin/structure-form', structure.id]);
  }

  deleteStructure(structure: Structure): void {
    if (confirm(`Supprimer "${structure.libelle}" ?`)) {
      this.http.delete(`http://localhost:8080/api/structures/${structure.id}`).subscribe({
        next: () => {
          this.structures = this.structures.filter(s => s.id !== structure.id);
          this.applySearch();
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de la suppression';
        }
      });
    }
  }
}