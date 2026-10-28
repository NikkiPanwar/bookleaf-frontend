import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { SignupComponent } from './features/auth/signup/signup.component';
import { AuthorLayoutComponent } from './layouts/author-layout/author-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { DashboardComponent } from './features/author/dashboard/dashboard.component';
import { BooksComponent } from './features/author/books/books.component';
import { TicketListComponent } from './features/author/tickets/ticket-list/ticket-list.component';
import { TicketCreateComponent } from './features/author/tickets/ticket-create/ticket-create.component';
import { TicketDetailComponent } from './features/author/tickets/ticket-detail/ticket-detail.component';
import { TicketQueueComponent } from './features/admin/tickets/ticket-queue/ticket-queue.component';
import { AdminTicketDetailComponent } from './features/admin/tickets/ticket-detail/ticket-detail.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

/**
 * Application Routes Configuration
 * Implements role-based routing and guards:
 * - Public: /login, /signup
 * - Author Portal: /author/* (Guarded: must be authenticated and have 'author' role)
 * - Admin Portal: /admin/* (Guarded: must be authenticated and have 'admin' role)
 */
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  // Author Portal Routes
  {
    path: 'author',
    component: AuthorLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'author' },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'books', component: BooksComponent },
      { path: 'tickets', component: TicketListComponent },
      { path: 'tickets/create', component: TicketCreateComponent },
      { path: 'tickets/:id', component: TicketDetailComponent }
    ]
  },

  // Admin Portal Routes
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'admin' },
    children: [
      { path: '', redirectTo: 'tickets', pathMatch: 'full' },
      { path: 'tickets', component: TicketQueueComponent },
      { path: 'tickets/:id', component: AdminTicketDetailComponent }
    ]
  },

  // Fallback
  { path: '**', redirectTo: 'login' }
];
