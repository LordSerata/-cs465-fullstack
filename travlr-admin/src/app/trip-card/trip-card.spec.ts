import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TripCard } from './trip-card';
import { Trip } from '../models/trip';

const mockTrip: Trip = {
  _id: '1', code: 'TEST', name: 'Mock Reef', length: '4 nights / 5 days',
  start: '2026-11-15T08:00:00.000Z', resort: 'Mock Resort', perPerson: '799.00',
  image: 'reef1.jpg', description: 'Mock description'
};

describe('TripCard (mock data)', () => {
  let fixture: ComponentFixture<TripCard>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripCard],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();
    fixture = TestBed.createComponent(TripCard);
    fixture.componentRef.setInput('trip', mockTrip);
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('shows the trip name, code and resort', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Mock Reef');
    expect(text).toContain('TEST');
    expect(text).toContain('Mock Resort');
  });

  it('sends a DELETE and tells the parent when Delete is clicked', () => {
    let emitted = false;
    fixture.componentInstance.deleted.subscribe(() => (emitted = true));
    fixture.nativeElement.querySelector('.btn-danger').click();
    const req = http.expectOne('http://localhost:3000/api/trips/TEST');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
    expect(emitted).toBeTrue();
  });
});
