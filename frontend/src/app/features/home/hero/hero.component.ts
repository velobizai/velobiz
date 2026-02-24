import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroComponent {
  readonly badgeText = 'Trusted by 100+ businesses';
  readonly headline = 'AI Automation that Accelerates Your Business';
  readonly subheading = 'Transform your operations with intelligent AI agents that work 24/7, scale instantly, and never miss a beat.';
}
