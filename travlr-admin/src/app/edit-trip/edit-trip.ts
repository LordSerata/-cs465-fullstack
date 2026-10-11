import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TripData } from '../services/trip-data';
import { Trip } from '../models/trip';

@Component({
  selector: 'app-edit-trip',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-trip.html',
  styleUrl: './edit-trip.css',
})
export class EditTrip implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private tripData = inject(TripData);

  editForm!: FormGroup;
  submitted = false;
  message = '';

  ngOnInit(): void {
    this.editForm = this.fb.group({
      _id: [],
      code: ['', Validators.required],
      name: ['', Validators.required],
      length: ['', Validators.required],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required]
    });

    const tripCode = this.route.snapshot.paramMap.get('code');
    if (!tripCode) {
      this.message = 'No trip code was given';
      return;
    }

    this.tripData.getTrip(tripCode).subscribe({
      next: (value: Trip[]) => {
        if (!value || value.length === 0) {
          this.message = 'Trip not found';
          return;
        }
        const trip = value[0];
        // the date input wants yyyy-MM-dd
        this.editForm.patchValue({ ...trip, start: trip.start ? trip.start.slice(0, 10) : '' });
      },
      error: (error: any) => {
        console.log('Error: ' + error.message);
        this.message = 'Could not load that trip';
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.editForm.valid) {
      this.tripData.updateTrip(this.editForm.value).subscribe({
        next: () => this.router.navigate(['']),
        error: (error: any) => {
          console.log('Error: ' + error.message);
          this.message = 'Could not update the trip';
        }
      });
    }
  }

  get f() {
    return this.editForm.controls;
  }
}
