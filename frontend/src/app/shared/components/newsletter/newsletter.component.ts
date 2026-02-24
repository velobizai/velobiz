import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-newsletter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ScrollRevealDirective],
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewsletterComponent {
  newsletterForm: FormGroup;
  submitting = signal<boolean>(false);
  submitSuccess = signal<boolean>(false);
  submitError = signal<string | null>(null);

  constructor(private fb: FormBuilder) {
    this.newsletterForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get emailControl() {
    return this.newsletterForm.get('email');
  }

  async onSubmit(): Promise<void> {
    if (this.newsletterForm.invalid) {
      this.newsletterForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.submitError.set(null);

    try {
      // TODO: Replace with actual API call
      await this.simulateApiCall(this.newsletterForm.value);

      this.submitSuccess.set(true);
      this.newsletterForm.reset();

      setTimeout(() => {
        this.submitSuccess.set(false);
      }, 5000);
    } catch (error) {
      this.submitError.set('Failed to subscribe. Please try again.');
    } finally {
      this.submitting.set(false);
    }
  }

  private simulateApiCall(data: any): Promise<void> {
    return new Promise((resolve) => {
      console.log('Newsletter subscription:', data);
      setTimeout(() => resolve(), 1000);
    });
  }
}
