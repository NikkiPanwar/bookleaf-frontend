import { Component } from '@angular/core';
import { RouterLink ,Router } from '@angular/router';
import { finalize, tap } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {

  isLoading = false;
  errorMessage = '';

  signupForm = new FormGroup({
    full_name:new FormControl('',{
      nonNullable:true ,
      validators:[Validators.required]
    }),
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

    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    const payload = this.signupForm.getRawValue();

    this.isLoading = true;

    this.authService.signup(payload).pipe(
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