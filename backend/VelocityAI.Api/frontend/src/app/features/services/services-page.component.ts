import { Component, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { ServiceCardComponent } from './service-card/service-card.component';
import { ServicesService } from '../../core/services/services.service';
import { Service } from '../../core/models/service.model';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-services-page',
  standalone: true,
  imports: [CommonModule, RouterLink, ServiceCardComponent, ScrollRevealDirective],
  templateUrl: './services-page.component.html',
  styleUrls: ['./services-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicesPageComponent implements OnInit {
  services = signal<Service[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  constructor(
    private servicesService: ServicesService,
    private title: Title,
    private meta: Meta
  ) {}

  ngOnInit(): void {
    this.setMetaTags();
    this.loadServices();
  }

  loadServices(): void {
    this.loading.set(true);
    this.error.set(null);

    this.servicesService.getServices().subscribe({
      next: (services) => {
        this.services.set(services);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load services. Please check your connection and try again.');
        this.loading.set(false);
        console.error('Services fetch error:', err);
      }
    });
  }

  retry(): void {
    this.servicesService.clearCache();
    this.loadServices();
  }

  private setMetaTags(): void {
    this.title.setTitle('AI Automation Services | VelocityAI');
    this.meta.updateTag({
      name: 'description',
      content: 'Discover our 8 AI automation services: Voice AI Agents, Email Management, Marketing Automation, and more. Transform your business with intelligent automation.'
    });
  }
}
