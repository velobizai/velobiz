import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';

interface PricingTier {
  id: string;
  name: string;
  description: string;
  price: string;
  priceSubtext: string;
  features: string[];
  popular?: boolean;
  ctaText: string;
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for small businesses testing AI automation',
    price: '$999',
    priceSubtext: 'per month',
    ctaText: 'Start Free Trial',
    features: [
      'Up to 1,000 AI interactions/month',
      '1 AI agent (chatbot or voice)',
      'Email support',
      'Basic analytics dashboard',
      'Standard integrations (Slack, email)',
      '30-day free trial'
    ]
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'For growing companies scaling operations',
    price: '$2,499',
    priceSubtext: 'per month',
    popular: true,
    ctaText: 'Get Started',
    features: [
      'Up to 10,000 AI interactions/month',
      '3 AI agents (mix of chatbot/voice)',
      'Priority email & chat support',
      'Advanced analytics & reporting',
      'Premium integrations (CRM, phone systems)',
      'Custom workflows',
      'Dedicated onboarding specialist'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Custom solutions for large organizations',
    price: 'Custom',
    priceSubtext: 'contact sales',
    ctaText: 'Contact Sales',
    features: [
      'Unlimited AI interactions',
      'Unlimited AI agents',
      '24/7 phone & Slack support',
      'White-label options',
      'Custom integrations & APIs',
      'SLA guarantees',
      'Dedicated account manager',
      'On-premise deployment options'
    ]
  }
];

@Component({
  selector: 'app-pricing-page',
  standalone: true,
  imports: [CommonModule, RouterLink, ScrollRevealDirective],
  templateUrl: './pricing-page.component.html',
  styleUrls: ['./pricing-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PricingPageComponent {
  readonly tiers = PRICING_TIERS;
  billingCycle = signal<'monthly' | 'annual'>('monthly');

  toggleBillingCycle(): void {
    this.billingCycle.set(this.billingCycle() === 'monthly' ? 'annual' : 'monthly');
  }
}
