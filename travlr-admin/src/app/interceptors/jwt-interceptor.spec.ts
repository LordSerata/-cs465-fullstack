import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { jwtInterceptor } from './jwt-interceptor';
import { BROWSER_STORAGE } from '../storage';
import { MockStorage, validToken } from '../testing/mock-auth';

describe('jwtInterceptor (mock data)', () => {
  let http: HttpClient;
  let ctrl: HttpTestingController;
  let storage: MockStorage;

  beforeEach(() => {
    storage = new MockStorage();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([jwtInterceptor])),
        provideHttpClientTesting(),
        { provide: BROWSER_STORAGE, useValue: storage }
      ]
    });
    http = TestBed.inject(HttpClient);
    ctrl = TestBed.inject(HttpTestingController);
  });
  afterEach(() => ctrl.verify());

  it('adds the Bearer token when logged in', () => {
    const token = validToken();
    storage.setItem('travlr-token', token);
    http.put('http://localhost:3000/api/trips/TEST', {}).subscribe();
    const req = ctrl.expectOne('http://localhost:3000/api/trips/TEST');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    req.flush({});
  });

  it('sends no token when logged out', () => {
    http.delete('http://localhost:3000/api/trips/TEST').subscribe();
    const req = ctrl.expectOne('http://localhost:3000/api/trips/TEST');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });

  it('does not attach a token to the login call', () => {
    storage.setItem('travlr-token', validToken());
    http.post('http://localhost:3000/api/login', {}).subscribe();
    const req = ctrl.expectOne('http://localhost:3000/api/login');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });
});
