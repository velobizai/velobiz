import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HeroComponent } from './hero/hero.component';
import { StatsBarComponent } from './stats-bar/stats-bar.component';
import { ProcessComponent } from './process/process.component';
import { IndustriesComponent } from './industries/industries.component';
import { CtaBannerComponent } from './cta-banner/cta-banner.component';
import { ClientLogosComponent } from '../../shared/components/client-logos/client-logos.component';
import { TestimonialsComponent } from '../../shared/components/testimonials/testimonials.component';
import { SocialProofComponent } from '../../shared/components/social-proof/social-proof.component';
import { NewsletterComponent } from '../../shared/components/newsletter/newsletter.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    HeroComponent,
    StatsBarComponent,
    ProcessComponent,
    IndustriesComponent,
    CtaBannerComponent,
    ClientLogosComponent,
    TestimonialsComponent,
    SocialProofComponent,
    NewsletterComponent
  ],
  template: `
    <main class="home-page">
      <app-hero />
      <app-social-proof />
      <app-client-logos />
      <app-stats-bar />
      <app-process />
      <app-industries />
      <app-testimonials />
      <app-newsletter />
      <app-cta-banner />
    </main>
  `,
  styles: [`
    :host {
      display: block;
    }

    .home-page {
      display: block;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent {}
