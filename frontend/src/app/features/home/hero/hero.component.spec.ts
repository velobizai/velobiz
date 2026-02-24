import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroComponent } from './hero.component';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('HeroComponent', () => {
  let component: HeroComponent;
  let fixture: ComponentFixture<HeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroComponent, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(HeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the hero section', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const heroSection = compiled.querySelector('section.hero');
    expect(heroSection).toBeTruthy();
  });

  it('should render the badge with correct text', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const badge = compiled.querySelector('.hero-badge');
    expect(badge?.textContent).toContain('Trusted by 100+ businesses');
  });

  it('should render the headline', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const headline = compiled.querySelector('.hero-headline');
    expect(headline?.textContent).toContain('AI Automation that Accelerates Your Business');
  });

  it('should render the subheading', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const subheading = compiled.querySelector('.hero-subheading');
    expect(subheading?.textContent).toContain('Transform your operations');
  });

  it('should render two CTA buttons', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = compiled.querySelectorAll('.hero-ctas button');
    expect(buttons.length).toBe(2);
  });

  it('should have primary button with correct text and route', () => {
    const debugElement = fixture.debugElement;
    const primaryButton = debugElement.query(By.css('.btn-primary'));
    expect(primaryButton.nativeElement.textContent.trim()).toBe('Get Started');
    expect(primaryButton.nativeElement.getAttribute('ng-reflect-router-link')).toBe('/contact');
  });

  it('should have secondary button with correct text and route', () => {
    const debugElement = fixture.debugElement;
    const secondaryButton = debugElement.query(By.css('.btn-secondary'));
    expect(secondaryButton.nativeElement.textContent.trim()).toBe('View Services');
    expect(secondaryButton.nativeElement.getAttribute('ng-reflect-router-link')).toBe('/services');
  });

  it('should render 3 glow orbs', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const glowOrbs = compiled.querySelectorAll('.glow-orb');
    expect(glowOrbs.length).toBe(3);
  });

  it('should render grid overlay', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const gridOverlay = compiled.querySelector('.grid-overlay');
    expect(gridOverlay).toBeTruthy();
  });

  it('should render scroll indicator', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const scrollIndicator = compiled.querySelector('.scroll-indicator');
    expect(scrollIndicator).toBeTruthy();
  });

  it('should have aria-label on primary button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const primaryButton = compiled.querySelector('.btn-primary');
    expect(primaryButton?.getAttribute('aria-label')).toBe('Schedule a free consultation');
  });

  it('should have aria-label on secondary button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const secondaryButton = compiled.querySelector('.btn-secondary');
    expect(secondaryButton?.getAttribute('aria-label')).toBe('View our AI automation services');
  });

  it('should have proper heading hierarchy with h1', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const h1 = compiled.querySelector('h1#hero-heading');
    expect(h1).toBeTruthy();
  });

  it('should have aria-labelledby on hero section', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const heroSection = compiled.querySelector('section.hero');
    expect(heroSection?.getAttribute('aria-labelledby')).toBe('hero-heading');
  });
});
