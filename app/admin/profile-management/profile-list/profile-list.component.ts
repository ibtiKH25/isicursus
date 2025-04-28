import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Profile {
  id: number;
  libelle: string;
}

@Component({
  selector: 'app-profile-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-list.component.html',
  styleUrls: ['./profile-list.component.css']
})
export class ProfileListComponent implements OnInit {
  profiles: Profile[] = [];
  filteredProfiles: Profile[] = [];
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
    this.loadProfiles();
  }

  loadProfiles(): void {
    this.isLoading = true;
    this.http.get<Profile[]>('http://localhost:8080/api/profiles').subscribe({
      next: (data) => {
        this.profiles = data;
        this.filteredProfiles = [...data];
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des profils';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  applyFilters(): void {
    let result = this.profiles;
    if (this.searchTerm) {
      result = result.filter(p =>
        p.libelle.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    result = [...result].sort((a, b) => {
      const libelleA = a.libelle.toLowerCase();
      const libelleB = b.libelle.toLowerCase();
      return this.sortDirection === 'asc'
        ? libelleA.localeCompare(libelleB)
        : libelleB.localeCompare(libelleA);
    });

    this.filteredProfiles = result;
    this.currentPage = 1;
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  toggleSort(): void {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.applyFilters();
  }

  get paginatedProfiles(): Profile[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredProfiles.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredProfiles.length / this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  openAddForm(): void {
    this.router.navigate(['/admin/profile-form']);
  }

  openEditForm(profile: Profile): void {
    this.router.navigate(['/admin/profile-form', profile.id]);
  }

  deleteProfile(profile: Profile): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce profil ?')) {
      this.http.delete(`http://localhost:8080/api/profiles/${profile.id}`).subscribe({
        next: () => {
          this.profiles = this.profiles.filter(p => p.id !== profile.id);
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