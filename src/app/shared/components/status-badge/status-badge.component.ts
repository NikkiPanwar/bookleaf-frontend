import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * StatusBadgeComponent
 * Shared UI component for displaying color-coded status and priority tags.
 */
@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="badge" [ngClass]="badgeClass">
      <span class="dot"></span>
      {{ value || 'N/A' }}
    </span>
  `,
  styles: [`
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 600;
      text-transform: capitalize;
      letter-spacing: 0.3px;
    }
    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: currentColor;
    }
    .status-open {
      background: #eff6ff;
      color: #2563eb;
      border: 1px solid #bfdbfe;
    }
    .status-in-progress {
      background: #fefce8;
      color: #ca8a04;
      border: 1px solid #fef08a;
    }
    .status-resolved {
      background: #f0fdf4;
      color: #16a34a;
      border: 1px solid #bbf7d0;
    }
    .status-closed {
      background: #f1f5f9;
      color: #64748b;
      border: 1px solid #cbd5e1;
    }
    .priority-critical,
    .priority-urgent {
      background: #fef2f2;
      color: #dc2626;
      border: 1px solid #fecaca;
      animation: pulse 2s infinite ease-in-out;
    }
    .priority-high {
      background: #fff7ed;
      color: #ea580c;
      border: 1px solid #fed7aa;
    }
    .priority-medium {
      background: #fefce8;
      color: #d97706;
      border: 1px solid #fef08a;
    }
    .priority-low {
      background: #f0fdf4;
      color: #16a34a;
      border: 1px solid #bbf7d0;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.75; }
    }
  `]
})
export class StatusBadgeComponent {
  @Input() value: string = '';
  @Input() type: 'status' | 'priority' = 'status';

  get badgeClass(): string {
    const normalized = (this.value || '').toLowerCase().replace(/\s+/g, '-');
    return `${this.type}-${normalized}`;
  }
}
