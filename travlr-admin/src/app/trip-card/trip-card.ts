import { Component, inject, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Trip } from '../models/trip';
import { TripData } from '../services/trip-data';
import { Authentication } from '../services/authentication';

@Component({
  selector: 'app-trip-card',
  imports: [DatePipe],
  templateUrl: './trip-card.html',
  styleUrl: './trip-card.css',
})
export class TripCard {
  private router = inject(Router);
  private tripData = inject(TripData);
  private auth = inject(Authentication);

  trip = input.required<Trip>();
  deleted = output<void>();

  imageBase = 'http://localhost:3000/images/';

  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  editTrip(): void {
    this.router.navigate(['edit-trip', this.trip().code]);
  }

  deleteTrip(): void {
    this.tripData.deleteTrip(this.trip().code).subscribe({
      next: () => this.deleted.emit(),
      error: (error: any) => console.log('Error: ' + error.message)
    });
  }
}
