import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

/**
 * Author Layout Component
 * Houses the dedicated Author portal layout and sidebar navigation.
 * Sidebar items strictly follow requirements:
 * 1. Dashboard
 * 2. My Books
 * 3. Submit a Support Query
 * 4. My Tickets
 * 5. Logout
 */
@Component({
  selector: 'app-author-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './author-layout.component.html',
  styleUrl: './author-layout.component.scss'
})
export class AuthorLayoutComponent {
  private authService = inject(AuthService);
  currentUser = this.authService.getCurrentUser();

  logout(): void {
    this.authService.logout();
  }
}
