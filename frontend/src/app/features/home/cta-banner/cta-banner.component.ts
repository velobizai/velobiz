import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollRevealDirective } from '../../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-cta-banner',
  standalone: true,
  imports: [RouterLink, ScrollRevealDirective],
  templateUrl: './cta-banner.component.html',
  styleUrls: ['./cta-banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CtaBannerComponent {
  readonly headline = 'Ready to Automate Your Business?';
  readonly subtext = 'Book a free 30-minute consultation to discover how AI agents can transform your operations.';
}
