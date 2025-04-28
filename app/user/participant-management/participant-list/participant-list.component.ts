import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Participant {
  id: number;
  nom: string;
  prenom: string;
  idStructure: number;
  idProfil: number;
  email: string;
  tel: number;
}

@Component({
  selector: 'app-participant-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './participant-list.component.html',
  styleUrls: ['./participant-list.component.css']
})
export class ParticipantListComponent implements OnInit {
  participants: Participant[] = [];
  filteredParticipants: Participant[] = [];
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
    this.loadParticipants();
  }

  loadParticipants(): void {
    this.isLoading = true;
    this.http.get<Participant[]>('http://localhost:8080/api/participants').subscribe({
      next: (data) => {
        this.participants = data;
        this.filteredParticipants = [...data];
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error loading participants';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  applyFilters(): void {
    let result = this.participants;
    if (this.searchTerm) {
      result = result.filter(p =>
        p.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        p.prenom.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    result = [...result].sort((a, b) => {
      const nameA = `${a.nom} ${a.prenom}`.toLowerCase();
      const nameB = `${b.nom} ${b.prenom}`.toLowerCase();
      return this.sortDirection === 'asc'
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });

    this.filteredParticipants = result;
    this.currentPage = 1;
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  toggleSort(): void {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.applyFilters();
  }

  get paginatedParticipants(): Participant[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredParticipants.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredParticipants.length / this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  openAddForm(): void {
    this.router.navigate(['/user/participant-form']);
  }

  openEditForm(participant: Participant): void {
    this.router.navigate(['/user/participant-form', participant.id]);
  }

  deleteParticipant(participant: Participant): void {
    if (confirm('Are you sure you want to delete this participant?')) {
      this.http.delete(`http://localhost:8080/api/participants/${participant.id}`).subscribe({
        next: () => {
          this.participants = this.participants.filter(p => p.id !== participant.id);
          this.applyFilters();
        },
        error: (err) => {
          this.errorMessage = 'Error deleting participant';
          console.error(err);
        }
      });
    }
  }
}