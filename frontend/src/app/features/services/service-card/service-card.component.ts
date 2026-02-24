import { Component, Input, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Service } from '../../../core/models/service.model';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './service-card.component.html',
  styleUrls: ['./service-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceCardComponent {
  @Input() service!: Service;
  expanded = signal<boolean>(false);
  
  get isMobile(): boolean {
    return typeof window !== 'undefined' && window.innerWidth < 768;
  }

  toggleExpanded(): void {
    if (this.isMobile) {
      this.expanded.update(val => !val);
    }
  }

  onHover(isHovering: boolean): void {
    if (!this.isMobile) {
      this.expanded.set(isHovering);
    }
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleExpanded();
    }
  }

  getIconEmoji(): string {
    const iconMap: { [key: string]: string } = {
      'phone': '📞',
      'signal': '📡',
      'mail': '📧',
      'megaphone': '📣',
      'share': '🔗',
      'target': '🎯',
      'brain': '🧠',
      'code': '💻'
    };
    return iconMap[this.service.icon] || '⚡';
  }
}
