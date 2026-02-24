import { Component, Input, signal, ChangeDetectionStrategy, HostListener } from '@angular/core';
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
  @Input({ required: true }) service!: Service;
  
  expanded = signal<boolean>(false);
  isMobile = signal<boolean>(false);

  ngOnInit(): void {
    this.checkMobile();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkMobile();
  }

  private checkMobile(): void {
    this.isMobile.set(window.innerWidth < 768);
  }

  toggleExpanded(): void {
    if (this.isMobile()) {
      this.expanded.update(val => !val);
    }
  }

  onMouseEnter(): void {
    if (!this.isMobile()) {
      this.expanded.set(true);
    }
  }

  onMouseLeave(): void {
    if (!this.isMobile()) {
      this.expanded.set(false);
    }
  }

  getIconEmoji(): string {
    const iconMap: Record<string, string> = {
      'phone': '📞',
      'signal': '📡',
      'mail': '📧',
      'megaphone': '📣',
      'share': '🔗',
      'target': '🎯',
      'brain': '🧠',
      'code': '💻'
    };
    return iconMap[this.service.icon] || '⚙️';
  }
}
