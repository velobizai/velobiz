import { Component, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import { FaqService } from '../../core/services/faq.service';
import { Faq } from '../../core/models/faq.model';

@Component({
  selector: 'app-faq-page',
  standalone: true,
  imports: [CommonModule, RouterLink, ScrollRevealDirective],
  templateUrl: './faq-page.component.html',
  styleUrls: ['./faq-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FaqPageComponent implements OnInit {
  faqs = signal<Faq[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  expandedIndex = signal<number | null>(null);

  constructor(
    private faqService: FaqService,
    private title: Title,
    private meta: Meta
  ) {}

  ngOnInit(): void {
    this.setMetaTags();
    this.loadFaqs();
  }

  loadFaqs(): void {
    this.loading.set(true);
    this.error.set(null);

    this.faqService.getFaqs().subscribe({
      next: (faqs) => {
        this.faqs.set(faqs);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load FAQs. Please try again.');
        this.loading.set(false);
        console.error('Error loading FAQs:', err);
      }
    });
  }

  retry(): void {
    this.loadFaqs();
  }

  toggleFaq(index: number): void {
    this.expandedIndex.set(this.expandedIndex() === index ? null : index);
  }

  private setMetaTags(): void {
    this.title.setTitle('Frequently Asked Questions | Velobiz');
    this.meta.updateTag({
      name: 'description',
      content: 'Get answers to common questions about Velobiz AI automation services, implementation timelines, integrations, and more.'
    });
    this.meta.updateTag({
      property: 'og:title',
      content: 'Frequently Asked Questions | Velobiz'
    });
    this.meta.updateTag({
      property: 'og:description',
      content: 'Get answers to common questions about Velobiz AI automation services.'
    });
  }
}
