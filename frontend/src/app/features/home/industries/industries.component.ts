import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollRevealDirective } from '../../../shared/directives/scroll-reveal.directive';

interface Industry {
  icon: string;
  name: string;
}

const INDUSTRIES: Industry[] = [
  { icon: '🏥', name: 'Healthcare' },
  { icon: '🏦', name: 'Financial Services' },
  { icon: '🛒', name: 'E-Commerce' },
  { icon: '🏢', name: 'Real Estate' },
  { icon: '💼', name: 'Professional Services' },
  { icon: '🎓', name: 'Education' },
  { icon: '🏭', name: 'Manufacturing' },
  { icon: '🚚', name: 'Logistics' }
];

@Component({
  selector: 'app-industries',
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective],
  templateUrl: './industries.component.html',
  styleUrls: ['./industries.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IndustriesComponent {
  readonly industries = INDUSTRIES;
}
