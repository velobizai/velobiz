import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  text: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'VP of Operations',
    company: 'TechFlow Inc',
    avatar: '👩‍💼',
    rating: 5,
    text: 'Velobiz transformed our customer support. Response times dropped from hours to seconds, and satisfaction scores jumped 40%. The AI agents handle complex queries with impressive accuracy.'
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    role: 'CEO',
    company: 'DataCorp Solutions',
    avatar: '👨‍💼',
    rating: 5,
    text: 'We automated 70% of our data entry workflows in just 3 weeks. The ROI was immediate—our team now focuses on strategic work instead of repetitive tasks.'
  },
  {
    id: '3',
    name: 'Emily Johnson',
    role: 'Head of Sales',
    company: 'GrowthLabs',
    avatar: '👩‍💻',
    rating: 5,
    text: 'Lead qualification became seamless. The AI agents score and route leads 24/7, and our sales team closes 35% more deals because they focus on high-intent prospects.'
  },
  {
    id: '4',
    name: 'David Kim',
    role: 'CTO',
    company: 'CloudScale',
    avatar: '👨‍🔧',
    rating: 5,
    text: 'Integration was surprisingly smooth. Their team worked with our existing stack, and the AI agents were production-ready in under a month. Support has been exceptional.'
  }
];

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective],
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestimonialsComponent {
  readonly testimonials = TESTIMONIALS;
  currentIndex = signal<number>(0);

  nextTestimonial(): void {
    this.currentIndex.update(index =>
      (index + 1) % this.testimonials.length
    );
  }

  previousTestimonial(): void {
    this.currentIndex.update(index =>
      index === 0 ? this.testimonials.length - 1 : index - 1
    );
  }

  goToTestimonial(index: number): void {
    this.currentIndex.set(index);
  }

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }
}
