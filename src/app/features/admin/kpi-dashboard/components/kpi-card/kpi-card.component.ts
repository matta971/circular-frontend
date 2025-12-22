import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <mat-card class="kpi-card" [class.compact]="compact">
      <div class="kpi-content">
        <div class="kpi-icon" [style.background]="iconBg">
          <mat-icon>{{ icon }}</mat-icon>
        </div>
        <div class="kpi-info">
          <span class="kpi-label">{{ label }}</span>
          <span class="kpi-value">
            @if (prefix) { <span class="prefix">{{ prefix }}</span> }
            {{ formattedValue }}
            @if (suffix) { <span class="suffix">{{ suffix }}</span> }
          </span>
          @if (trend !== undefined && trend !== null) {
            <span class="kpi-trend" [class.positive]="trend > 0" [class.negative]="trend < 0">
              <mat-icon>{{ trend > 0 ? 'trending_up' : trend < 0 ? 'trending_down' : 'trending_flat' }}</mat-icon>
              {{ trend > 0 ? '+' : '' }}{{ trend | number:'1.1-1' }}%
            </span>
          }
        </div>
      </div>
    </mat-card>
  `,
  styles: [`
    .kpi-card {
      height: 100%;

      &.compact {
        .kpi-content {
          padding: 1rem;
        }
        .kpi-icon {
          width: 40px;
          height: 40px;
          mat-icon {
            font-size: 20px;
            width: 20px;
            height: 20px;
          }
        }
        .kpi-value {
          font-size: 1.25rem;
        }
      }
    }

    .kpi-content {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1.25rem;
    }

    .kpi-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      mat-icon {
        color: white;
        font-size: 24px;
        width: 24px;
        height: 24px;
      }
    }

    .kpi-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      min-width: 0;
    }

    .kpi-label {
      font-size: 0.85rem;
      color: #666;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .kpi-value {
      font-size: 1.5rem;
      font-weight: 600;
      color: #333;
      line-height: 1.2;

      .prefix, .suffix {
        font-size: 1rem;
        font-weight: 400;
        color: #666;
      }
    }

    .kpi-trend {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.8rem;
      color: #666;

      mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }

      &.positive {
        color: #4caf50;
      }

      &.negative {
        color: #f44336;
      }
    }
  `]
})
export class KpiCardComponent {
  @Input() label = '';
  @Input() value: number | string = 0;
  @Input() trend?: number;
  @Input() icon = 'analytics';
  @Input() iconBg = '#1976d2';
  @Input() prefix = '';
  @Input() suffix = '';
  @Input() compact = false;
  @Input() format: 'number' | 'currency' | 'percent' | 'duration' = 'number';

  get formattedValue(): string {
    if (typeof this.value === 'string') return this.value;

    const num = this.value as number;
    switch (this.format) {
      case 'currency':
        return new Intl.NumberFormat('fr-FR', {
          style: 'decimal',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(num);
      case 'percent':
        return num.toFixed(1);
      case 'duration':
        if (num < 1) return `${Math.round(num * 60)} min`;
        return num.toFixed(1);
      default:
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
        return new Intl.NumberFormat('fr-FR').format(num);
    }
  }
}
