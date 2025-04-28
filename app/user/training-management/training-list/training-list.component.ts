import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ScheduleModule, EventSettingsModel } from '@syncfusion/ej2-angular-schedule';
import { DayService, WeekService, WorkWeekService, MonthService, AgendaService } from '@syncfusion/ej2-angular-schedule';

interface Training {
  id: number;
  titre: string;
  annee: number;
  duree: number;
  idDomaine: number;
  budget: number;
  startTime?: Date;
  endTime?: Date;
}

@Component({
  selector: 'app-training-list',
  standalone: true,
  imports: [CommonModule, ScheduleModule],
  templateUrl: './training-list.component.html',
  styleUrls: ['./training-list.component.css'],
  providers: [DayService, WeekService, WorkWeekService, MonthService, AgendaService]
})
export class TrainingListComponent implements OnInit {
  trainings: Training[] = [];
  eventSettings: EventSettingsModel = { dataSource: [] };
  currentView: string = 'Month';
  selectedDate: Date = new Date();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTrainings();
  }

  loadTrainings(): void {
    this.http.get<Training[]>('http://localhost:8080/api/trainings').subscribe({
      next: (data) => {
        this.trainings = data;
        this.prepareCalendarData();
      },
      error: (err) => {
        console.error('Error loading trainings:', err);
      }
    });
  }

  prepareCalendarData(): void {
    this.eventSettings = {
      dataSource: this.trainings.map(training => ({
        Id: training.id,
        Subject: training.titre,
        StartTime: new Date(training.annee, 0, 1),
        EndTime: new Date(training.annee, 0, training.duree),
        IsAllDay: true,
        Description: `Durée: ${training.duree} jours | Budget: ${training.budget}€`
      }))
    };
  }

  onEventClick(args: any): void {
    if (args?.event?.Id) {
      this.router.navigate(['/admin/training-details', args.event.Id]);
    }
  }

  addNewTraining(): void {
    this.router.navigate(['/admin/training-form']);
  }
}