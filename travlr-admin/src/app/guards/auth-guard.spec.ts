import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { authGuard } from './auth-guard';
import { BROWSER_STORAGE } from '../storage';
import { MockStorage, validToken } from '../testing/mock-auth';

describe('authGuard (mock data)', () => {
  let storage: MockStorage;
  const run = () => TestBed.runInInjectionContext(() =>
    authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot));

  beforeEach(() => {
    storage = new MockStorage();
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), { provide: BROWSER_STORAGE, useValue: storage }]
    });
  });

  it('sends logged out users to /login', () => {
    const result = run() as UrlTree;
    expect(TestBed.inject(Router).serializeUrl(result)).toBe('/login');
  });

  it('lets logged in users through', () => {
    storage.setItem('travlr-token', validToken());
    expect(run()).toBeTrue();
  });
});
