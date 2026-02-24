import { Routes } from '@angular/router';
import { HomePageComponent } from './features/home/home-page.component';
import { ServicesPageComponent } from './features/services/services-page.component';
import { PricingPageComponent } from './features/pricing/pricing-page.component';
import { FaqPageComponent } from './features/faq/faq-page.component';
import { ContactPageComponent } from './features/contact/contact-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    title: 'VelocityAI - AI Automation that Accelerates Your Business'
  },
  {
    path: 'services',
    component: ServicesPageComponent,
    title: 'Services - VelocityAI'
  },
  {
    path: 'pricing',
    component: PricingPageComponent,
    title: 'Pricing - VelocityAI'
  },
  {
    path: 'faq',
    component: FaqPageComponent,
    title: 'FAQ - VelocityAI'
  },
  {
    path: 'contact',
    component: ContactPageComponent,
    title: 'Contact Us - VelocityAI'
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
