import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import { ContactService } from '../../core/services/contact.service';

interface ContactInfo {
  icon: string;
  title: string;
  value: string;
  link?: string;
}

const CONTACT_INFO: ContactInfo[] = [
  {
    icon: '📧',
    title: 'Email',
    value: 'hello@velocityai.com',
    link: 'mailto:hello@velocityai.com'
  },
  {
    icon: '📞',
    title: 'Phone',
    value: '+1 (555) 123-4567',
    link: 'tel:+15551234567'
  },
  {
    icon: '🏢',
    title: 'Office',
    value: 'San Francisco, CA'
  }
];

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ScrollRevealDirective],
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactPageComponent {
  readonly contactInfo = CONTACT_INFO;
  readonly serviceInterestOptions = [
    'AI Voice Agent — Inbound Support',
    'AI Voice Agent — Outbound Collection',
    'Email Management AI Agent',
    'Marketing Campaign AI Agent',
    'Social Media Scheduling & Management',
    'Paid Ads AI Agent',
    'GEO — Generative Engine Optimisation',
    'SDLC AI Agent Suite',
    'Not sure yet'
  ];

  contactForm: FormGroup;
  submitting = signal<boolean>(false);
  submitSuccess = signal<boolean>(false);
  submitError = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      company: [''],
      phone: [''],
      message: ['', [Validators.required, Validators.minLength(10)]],
      serviceInterest: ['', [Validators.required]],
      honeypot: ['']
    });
  }

  get nameControl() {
    return this.contactForm.get('name');
  }

  get emailControl() {
    return this.contactForm.get('email');
  }

  get messageControl() {
    return this.contactForm.get('message');
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.submitError.set(null);

    this.contactService.submit(this.contactForm.value).subscribe({
      next: () => {
        this.submitSuccess.set(true);
        this.contactForm.reset();
        setTimeout(() => this.submitSuccess.set(false), 5000);
      },
      error: (error: any) => {
        const errorMessage = error?.error?.message || error?.message ||
          'Failed to send message. Please try again or contact us directly via email.';
        this.submitError.set(errorMessage);
      },
      complete: () => {
        this.submitting.set(false);
      }
    });
  }
}
