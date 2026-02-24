import { Component, HostListener, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressBarComponent {
  progress = signal<number>(0);

  @HostListener('window:scroll')
  onWindowScroll(): void {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;

    const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;
    this.progress.set(Math.min(Math.max(scrollPercentage, 0), 100));
  }
}
