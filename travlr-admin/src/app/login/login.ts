import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Authentication } from '../services/authentication';
import { User } from '../models/user';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private auth = inject(Authentication);
  private router = inject(Router);

  credentials = { email: '', password: '' };
  formError = '';

  onLoginSubmit(): void {
    this.formError = '';
    if (!this.credentials.email || !this.credentials.password) {
      this.formError = 'All fields are required, please try again';
      return;
    }
    const user = { email: this.credentials.email, name: '' } as User;
    this.auth.login(user, this.credentials.password).subscribe({
      next: () => this.router.navigate(['']),
      error: () => (this.formError = 'Wrong email or password, please try again')
    });
  }
}
