import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Participant {
  id: number;
  nom: string;
  prenom: string;
  idStructure: number;
  idProfil: number;
  email: string;
  tel: number;
}

interface Structure {
  id: number;
  nom: string;
}

interface Profil {
  id: number;
  libelle: string;
}

@Component({
  selector: 'app-participant-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './participant-form.component.html',
  styleUrls: ['./participant-form.component.css']
})
export class ParticipantFormComponent implements OnInit {
  participantForm: FormGroup;
  structures: Structure[] = [];
  profils: Profil[] = [];
  isSubmitting: boolean = false;
  errorMessage: string | null = null;
  isEditMode: boolean = false;
  participantId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.participantForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      prenom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      idStructure: [null, Validators.required],
      idProfil: [null, Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      tel: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]]
    });
  }

  ngOnInit(): void {
    this.loadStructures();
    this.loadProfils();

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.participantId = +params['id'];
        this.loadParticipant(this.participantId);
      }
    });
  }

  loadStructures(): void {
    this.http.get<Structure[]>('http://localhost:8080/structures').subscribe({
      next: (data) => {
        this.structures = data;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des structures';
        console.error(err);
      }
    });
  }

  loadProfils(): void {
    this.http.get<Profil[]>('http://localhost:8080/profils').subscribe({
      next: (data) => {
        this.profils = data;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des profils';
        console.error(err);
      }
    });
  }

  loadParticipant(id: number): void {
    this.http.get<Participant>(`http://localhost:8080/participants/${id}`).subscribe({
      next: (participant) => {
        this.participantForm.patchValue({
          nom: participant.nom,
          prenom: participant.prenom,
          idStructure: participant.idStructure,
          idProfil: participant.idProfil,
          email: participant.email,
          tel: participant.tel
        });
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement du participant';
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    if (this.participantForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = null;
      
      const participantData = this.participantForm.value;

      const request = this.isEditMode && this.participantId
        ? this.http.put(`http://localhost:8080/participants/${this.participantId}`, {
            ...participantData,
            id: this.participantId
          })
        : this.http.post('http://localhost:8080/participants', participantData);

      request.subscribe({
        next: () => {
          this.router.navigate(['/user/participant-list']);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.errorMessage = err.error?.message || 'Une erreur est survenue';
          console.error(err);
        }
      });
    } else {
      this.participantForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/user/participant-list']);
  }

  get nom() { return this.participantForm.get('nom'); }
  get prenom() { return this.participantForm.get('prenom'); }
  get idStructure() { return this.participantForm.get('idStructure'); }
  get idProfil() { return this.participantForm.get('idProfil'); }
  get email() { return this.participantForm.get('email'); }
  get tel() { return this.participantForm.get('tel'); }
}