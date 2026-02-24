import { Component, ChangeDetectionStrategy, signal, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Stat {
  id: string;
  value: number;
  suffix: string;
  label: string;
  format?: 'K' | 'M';
}

const STATS: Stat[] = [
  { id: 'clients', value: 500, suffix: '+', label: 'Clients Served' },
  { id: 'hours', value: 2000000, suffix: '+', label: 'Hours Saved', format: 'M' },
  { id: 'uptime', value: 99, suffix: '%', label: 'Uptime Guarantee' },
  { id: 'support', value: 24, suffix: '/7', label: 'Support Availability' }
];

@Component({
  selector: 'app-stats-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-bar.component.html',
  styleUrls: ['./stats-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatsBarComponent implements AfterViewInit, OnDestroy {
  readonly stats = STATS;
  animatedValues = signal<Map<string, number>>(new Map());
  hasAnimated = signal(false);
  private observer?: IntersectionObserver;

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.hasAnimated()) {
            this.animateCounters();
            this.hasAnimated.set(true);
          }
        });
      },
      { threshold: 0.5 }
    );

    this.observer.observe(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private animateCounters(): void {
    this.stats.forEach(stat => {
      this.animateValue(stat.id, 0, stat.value, 2000);
    });
  }

  private animateValue(key: string, start: number, end: number, duration: number): void {
    const startTime = performance.now();

    const updateValue = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(start + (end - start) * progress);

      this.animatedValues.update(values => {
        const newValues = new Map(values);
        newValues.set(key, current);
        return newValues;
      });

      if (progress < 1) {
        requestAnimationFrame(updateValue);
      }
    };

    requestAnimationFrame(updateValue);
  }

  getAnimatedValue(stat: Stat): string {
    const value = this.animatedValues().get(stat.id) || 0;

    if (stat.format === 'M') {
      return (value / 1000000).toFixed(1) + 'M';
    } else if (stat.format === 'K') {
      return (value / 1000).toFixed(0) + 'K';
    }

    return value.toString();
  }
}
