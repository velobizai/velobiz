import { Directive, ElementRef, HostListener, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appParallax]',
  standalone: true
})
export class ParallaxDirective implements OnInit {
  @Input() parallaxSpeed: number = 0.5; // Speed multiplier (0 = no movement, 1 = normal scroll speed)
  @Input() parallaxDirection: 'vertical' | 'horizontal' = 'vertical';

  private initialTop: number = 0;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    const rect = this.el.nativeElement.getBoundingClientRect();
    this.initialTop = rect.top + window.pageYOffset;
    this.updatePosition();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.updatePosition();
  }

  private updatePosition(): void {
    const scrolled = window.pageYOffset;
    const elementOffset = scrolled - this.initialTop;
    const movement = elementOffset * this.parallaxSpeed;

    if (this.parallaxDirection === 'vertical') {
      this.renderer.setStyle(
        this.el.nativeElement,
        'transform',
        `translateY(${movement}px)`
      );
    } else {
      this.renderer.setStyle(
        this.el.nativeElement,
        'transform',
        `translateX(${movement}px)`
      );
    }
  }
}
