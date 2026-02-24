import { Directive, ElementRef, OnInit, OnDestroy, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appScrollReveal]',
  standalone: true
})
export class ScrollRevealDirective implements OnInit, OnDestroy {
  private observer?: IntersectionObserver;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    // Add initial hidden state
    this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateY(30px)');
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'opacity 0.6s ease-out, transform 0.6s ease-out');

    // Create IntersectionObserver
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.reveal();
          }
        });
      },
      {
        threshold: 0.05,  // Reduced from 0.1 to trigger earlier
        rootMargin: '0px 0px 0px 0px'  // Remove negative margin that was blocking reveals
      }
    );

    this.observer.observe(this.el.nativeElement);

    // CRITICAL FIX: Reveal immediately if element is already in viewport (above fold)
    // This fixes the issue where content loads but stays hidden
    setTimeout(() => {
      const rect = this.el.nativeElement.getBoundingClientRect();
      const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
      if (isInViewport) {
        this.reveal();
      }
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private reveal(): void {
    this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateY(0)');

    // Disconnect observer after revealing (one-time animation)
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
