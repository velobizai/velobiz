import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CtaBannerComponent } from './cta-banner.component';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('CtaBannerComponent', () => {
  let component: CtaBannerComponent;
  let fixture: ComponentFixture<CtaBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CtaBannerComponent, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(CtaBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render CTA banner section', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const ctaBanner = compiled.querySelector('.cta-banner');
    expect(ctaBanner).toBeTruthy();
  });

  it('should render headline', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const headline = compiled.querySelector('.cta-headline');
    expect(headline?.textContent).toContain('Ready to Automate Your Business?');
  });

  it('should render subtext', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const subtext = compiled.querySelector('.cta-subtext');
    expect(subtext?.textContent).toContain('Book a free 30-minute consultation');
  });

  it('should render primary button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('.btn-primary');
    expect(button).toBeTruthy();
    expect(button?.textContent?.trim()).toBe('Schedule Consultation');
  });

  it('should have correct route on button', () => {
    const debugElement = fixture.debugElement;
    const button = debugElement.query(By.css('.btn-primary'));
    expect(button.nativeElement.getAttribute('ng-reflect-router-link')).toBe('/contact');
  });

  it('should have aria-label on button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('.btn-primary');
    expect(button?.getAttribute('aria-label')).toBe('Schedule a free consultation');
  });

  it('should have ScrollRevealDirective applied', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const section = compiled.querySelector('[appScrollReveal]');
    expect(section).toBeTruthy();
  });

  it('should have proper heading hierarchy', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const h2 = compiled.querySelector('h2#cta-heading');
    expect(h2).toBeTruthy();
  });

  it('should have aria-labelledby on CTA banner section', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const section = compiled.querySelector('section.cta-banner');
    expect(section?.getAttribute('aria-labelledby')).toBe('cta-heading');
  });

  it('should have correct headline in component property', () => {
    expect(component.headline).toBe('Ready to Automate Your Business?');
  });

  it('should have correct subtext in component property', () => {
    expect(component.subtext).toContain('Book a free 30-minute consultation');
  });
});
