import { Component, OnInit, inject } from '@angular/core';
import { Trip } from '../models/trip';
import { TripData } from '../services/trip-data';
import { TripCard } from '../trip-card/trip-card';

@Component({
  selector: 'app-trip-listing',
  imports: [TripCard],
  templateUrl: './trip-listing.html',
  styleUrl: './trip-listing.css',
})
export class TripListing implements OnInit {
  private tripData = inject(TripData);
  trips: Trip[] = [];
  message = '';

  ngOnInit(): void {
    this.getTrips();
  }

  getTrips(): void {
    this.tripData.getTrips().subscribe({
      next: (value: Trip[]) => {
        this.trips = value;
        this.message = value.length > 0 ? '' : 'There were no trips retrieved from the database';
      },
      error: (error: any) => {
        console.log('Error: ' + error.message);
        this.message = 'Could not reach the API. Is it running on port 3000?';
      }
    });
  }
}
