import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { Authentication } from './services/authentication';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private auth = inject(Authentication);
  private router = inject(Router);
  title = 'Travlr Getaways Admin';

  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  userName(): string {
    return this.auth.getCurrentUser()?.name ?? '';
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['']);
  }
}
