import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TripData } from '../services/trip-data';

@Component({
  selector: 'app-add-trip',
  imports: [ReactiveFormsModule],
  templateUrl: './add-trip.html',
  styleUrl: './add-trip.css',
})
export class AddTrip implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private tripData = inject(TripData);

  addForm!: FormGroup;
  submitted = false;
  message = '';

  ngOnInit(): void {
    this.addForm = this.fb.group({
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
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.addForm.valid) {
      this.tripData.addTrip(this.addForm.value).subscribe({
        next: () => this.router.navigate(['']),
        error: (error: any) => {
          console.log('Error: ' + error.message);
          this.message = 'Could not add the trip. Make sure every field is filled in.';
        }
      });
    }
  }

  get f() {
    return this.addForm.controls;
  }
}
