import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize, tap } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  isLoading = false;
  errorMessage = '';

  loginForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    })
  });

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }


  onSubmit(): void {
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const payload = this.loginForm.getRawValue();

    this.isLoading = true;

    this.authService.login(payload).pipe(
      tap(response => {
        if (response.success) {
          const token = response.data.access_token;
          const user = response.data.user;

          localStorage.setItem('bookleaf_token', token);
          localStorage.setItem('bookleaf_user', JSON.stringify(user));

          this.authService.setCurrentUser(user);

          if (user.role === 'author') {
            this.router.navigate(['/author/dashboard']);
          } else if (user.role === 'admin') {
            this.router.navigate(['/admin/tickets']);
          }
        } 
      }),
      finalize(() => {
        this.isLoading = false
      })
    ).subscribe(
      {
        error: (error) => {
          this.errorMessage =
            error.error?.detail ||
            error.error?.message ||
            'Login failed. Please try again.';
        }
      }
    )
  }
}