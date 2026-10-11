import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TripListing } from './trip-listing';
import { Trip } from '../models/trip';

const mockTrips: Trip[] = [
  { _id: '1', code: 'AAAA', name: 'Mock One', length: '3 nights', start: '2026-11-15T08:00:00.000Z', resort: 'R1', perPerson: '100', image: 'reef1.jpg', description: 'd1' },
  { _id: '2', code: 'BBBB', name: 'Mock Two', length: '4 nights', start: '2026-12-15T08:00:00.000Z', resort: 'R2', perPerson: '200', image: 'reef2.jpg', description: 'd2' }
];

describe('TripListing (mock data)', () => {
  let fixture: ComponentFixture<TripListing>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripListing],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();
    fixture = TestBed.createComponent(TripListing);
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('asks the API for trips and shows one card per trip', () => {
    const req = http.expectOne('http://localhost:3000/api/trips');
    expect(req.request.method).toBe('GET');
    req.flush(mockTrips);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('app-trip-card').length).toBe(2);
    expect(fixture.nativeElement.textContent).toContain('Mock Two');
  });

  it('shows a message when the API returns no trips', () => {
    http.expectOne('http://localhost:3000/api/trips').flush([]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.alert').textContent).toContain('no trips');
  });
});
