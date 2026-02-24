import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

interface Badge {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
}

const BADGES: Badge[] = [
  {
    id: '1',
    icon: '🏆',
    title: 'SOC 2 Certified',
    subtitle: 'Enterprise Security'
  },
  {
    id: '2',
    icon: '⭐',
    title: '4.9/5 Rating',
    subtitle: '200+ Reviews'
  },
  {
    id: '3',
    icon: '🔒',
    title: 'GDPR Compliant',
    subtitle: 'Data Protection'
  },
  {
    id: '4',
    icon: '✅',
    title: '99.9% Uptime',
    subtitle: 'SLA Guaranteed'
  }
];

@Component({
  selector: 'app-social-proof',
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective],
  templateUrl: './social-proof.component.html',
  styleUrls: ['./social-proof.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SocialProofComponent {
  readonly badges = BADGES;
}
