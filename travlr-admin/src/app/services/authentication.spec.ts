import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Authentication } from './authentication';
import { BROWSER_STORAGE } from '../storage';
import { MockStorage, validToken, expiredToken } from '../testing/mock-auth';

describe('Authentication service (mock data)', () => {
  let auth: Authentication;
  let http: HttpTestingController;
  let storage: MockStorage;

  beforeEach(() => {
    storage = new MockStorage();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: BROWSER_STORAGE, useValue: storage }
      ]
    });
    auth = TestBed.inject(Authentication);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  it('is logged out when there is no token', () => {
    expect(auth.isLoggedIn()).toBeFalse();
    expect(auth.getCurrentUser()).toBeNull();
  });

  it('logs in, saves the token, and reads the user from it', () => {
    const token = validToken();
    auth.login({ email: 'admin@travlr.com', name: '' }, 'secret').subscribe();
    const req = http.expectOne('http://localhost:3000/api/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'admin@travlr.com', password: 'secret' });
    req.flush({ token });

    expect(storage.getItem('travlr-token')).toBe(token);
    expect(auth.isLoggedIn()).toBeTrue();
    expect(auth.getCurrentUser()?.name).toBe('Admin');
  });

  it('treats an expired token as logged out', () => {
    auth.saveToken(expiredToken());
    expect(auth.isLoggedIn()).toBeFalse();
  });

  it('treats a garbage token as logged out', () => {
    auth.saveToken('not-a-real-token');
    expect(auth.isLoggedIn()).toBeFalse();
  });

  it('logout clears the token', () => {
    auth.saveToken(validToken());
    auth.logout();
    expect(storage.getItem('travlr-token')).toBeNull();
    expect(auth.isLoggedIn()).toBeFalse();
  });

  it('does not save a token when login fails', () => {
    auth.login({ email: 'admin@travlr.com', name: '' }, 'wrong').subscribe({ error: () => {} });
    http.expectOne('http://localhost:3000/api/login')
      .flush({ message: 'Incorrect password.' }, { status: 401, statusText: 'Unauthorized' });
    expect(auth.isLoggedIn()).toBeFalse();
  });
});
