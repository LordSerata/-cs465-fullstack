import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TripData } from './trip-data';
import { Trip } from '../models/trip';

const mockTrip: Trip = { _id: '1', code: 'TEST', name: 'Mock', length: '3 nights', start: '2026-11-15', resort: 'R', perPerson: '100', image: 'reef1.jpg', description: 'd' };

describe('TripData service (mock data)', () => {
  let service: TripData;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(TripData);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  it('GET one trip', () => {
    service.getTrip('TEST').subscribe(t => expect(t[0].code).toBe('TEST'));
    const r = http.expectOne('http://localhost:3000/api/trips/TEST');
    expect(r.request.method).toBe('GET');
    r.flush([mockTrip]);
  });
  it('POST a trip', () => {
    service.addTrip(mockTrip).subscribe();
    const r = http.expectOne('http://localhost:3000/api/trips');
    expect(r.request.method).toBe('POST');
    expect(r.request.body.name).toBe('Mock');
    r.flush(mockTrip);
  });
  it('PUT a trip using its code in the URL', () => {
    service.updateTrip(mockTrip).subscribe();
    const r = http.expectOne('http://localhost:3000/api/trips/TEST');
    expect(r.request.method).toBe('PUT');
    r.flush(mockTrip);
  });
});
