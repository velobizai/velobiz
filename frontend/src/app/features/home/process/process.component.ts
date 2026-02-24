import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollRevealDirective } from '../../../shared/directives/scroll-reveal.directive';

interface ProcessStep {
  number: number;
  title: string;
  description: string;
}

const PROCESS_STEPS: ProcessStep[] = [
  {
    number: 1,
    title: 'Discovery Call',
    description: 'We understand your workflow, pain points, and automation goals in a free 30-minute consultation.'
  },
  {
    number: 2,
    title: 'Custom Design',
    description: 'Our team builds AI agents tailored to your business processes, brand voice, and compliance requirements.'
  },
  {
    number: 3,
    title: 'Integration',
    description: 'We deploy your AI agents with your existing tools: CRM, email, phone systems, and more.'
  },
  {
    number: 4,
    title: 'Optimization',
    description: 'Continuous monitoring, performance tuning, and iterative improvements based on real-world usage data.'
  }
];

@Component({
  selector: 'app-process',
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective],
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProcessComponent {
  readonly steps = PROCESS_STEPS;
}
