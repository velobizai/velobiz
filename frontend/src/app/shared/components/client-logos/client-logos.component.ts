import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

interface ClientLogo {
  id: string;
  name: string;
  logo: string;
}

const CLIENT_LOGOS: ClientLogo[] = [
  { id: '1', name: 'TechFlow', logo: '🚀' },
  { id: '2', name: 'DataCorp', logo: '📊' },
  { id: '3', name: 'GrowthLabs', logo: '📈' },
  { id: '4', name: 'CloudScale', logo: '☁️' },
  { id: '5', name: 'InnovateCo', logo: '💡' },
  { id: '6', name: 'DigitalEdge', logo: '⚡' },
  { id: '7', name: 'FutureSync', logo: '🔮' },
  { id: '8', name: 'NextGen', logo: '🌟' }
];

@Component({
  selector: 'app-client-logos',
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective],
  templateUrl: './client-logos.component.html',
  styleUrls: ['./client-logos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientLogosComponent {
  readonly logos = [...CLIENT_LOGOS, ...CLIENT_LOGOS]; // Duplicate for seamless loop
}
