import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Login } from './login';
import { BROWSER_STORAGE } from '../storage';
import { MockStorage, validToken } from '../testing/mock-auth';

describe('Login component (mock data)', () => {
  let fixture: ComponentFixture<Login>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting(),
        { provide: BROWSER_STORAGE, useValue: new MockStorage() }]
    }).compileComponents();
    fixture = TestBed.createComponent(Login);
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('shows an error if fields are empty and sends nothing', () => {
    fixture.componentInstance.onLoginSubmit();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('All fields are required');
    http.expectNone('http://localhost:3000/api/login');
  });

  it('shows an error on a wrong password', () => {
    fixture.componentInstance.credentials = { email: 'admin@travlr.com', password: 'wrong' };
    fixture.componentInstance.onLoginSubmit();
    http.expectOne('http://localhost:3000/api/login')
      .flush({ message: 'Incorrect password.' }, { status: 401, statusText: 'Unauthorized' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Wrong email or password');
  });

  it('goes to the trip list after a good login', () => {
    const nav = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    fixture.componentInstance.credentials = { email: 'admin@travlr.com', password: 'right' };
    fixture.componentInstance.onLoginSubmit();
    http.expectOne('http://localhost:3000/api/login').flush({ token: validToken() });
    expect(nav).toHaveBeenCalledWith(['']);
  });
});
