import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

/**
 * Admin Layout Component
 * Dedicated Admin Portal layout.
 * Admin sidebar items strictly follow requirements:
 * 1. Ticket Queue
 * 2. Logout
 */
@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {
  private authService = inject(AuthService);
  currentUser = this.authService.getCurrentUser();

  logout(): void {
    this.authService.logout();
  }
}
