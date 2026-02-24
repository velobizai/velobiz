import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { FooterComponent } from './footer.component';
import { FOOTER_QUICK_LINKS, FOOTER_COMPANY_LINKS, FOOTER_LEGAL_LINKS, FOOTER_BRAND } from '../layout.config';
import { environment } from '../../../environments/environment';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should load Quick Links from config', () => {
      expect(component.quickLinks).toEqual(FOOTER_QUICK_LINKS);
    });

    it('should load Company Links from config', () => {
      expect(component.companyLinks).toEqual(FOOTER_COMPANY_LINKS);
    });

    it('should load Legal Links from config', () => {
      expect(component.legalLinks).toEqual(FOOTER_LEGAL_LINKS);
    });

    it('should load social links from environment', () => {
      expect(component.socialLinks).toEqual(environment.social);
    });

    it('should display current year in copyright', () => {
      const currentYear = new Date().getFullYear();
      expect(component.currentYear).toBe(currentYear);
    });

    it('should load brand information', () => {
      expect(component.brand).toEqual(FOOTER_BRAND);
    });
  });

  describe('Link Rendering', () => {
    it('should render all Quick Links (5 items)', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const quickLinksSection = compiled.querySelectorAll('.footer__column')[1];
      const quickLinks = quickLinksSection?.querySelectorAll('.footer__link');
      expect(quickLinks?.length).toBe(5);
    });

    it('should render all Company Links (3 items)', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const companySection = compiled.querySelectorAll('.footer__column')[2];
      const companyLinks = companySection?.querySelectorAll('.footer__link');
      expect(companyLinks?.length).toBe(3);
    });

    it('should render all Legal Links (3 items)', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const legalSection = compiled.querySelectorAll('.footer__column')[3];
      const legalLinks = legalSection?.querySelectorAll('.footer__link');
      expect(legalLinks?.length).toBe(3);
    });

    it('should render Quick Links with correct labels', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const quickLinksSection = compiled.querySelectorAll('.footer__column')[1];
      const firstLink = quickLinksSection?.querySelector('.footer__link') as HTMLAnchorElement;
      expect(firstLink?.textContent?.trim()).toBe('Home');
    });

    it('should render Company Links with href="#"', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const companySection = compiled.querySelectorAll('.footer__column')[2];
      const companyLinks = companySection?.querySelectorAll('.footer__link') as NodeListOf<HTMLAnchorElement>;

      companyLinks?.forEach(link => {
        expect(link.getAttribute('href')).toBe('#');
      });
    });
  });

  describe('Social Icons', () => {
    it('should render all 3 social icons', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const socialIcons = compiled.querySelectorAll('.footer__social-icon');
      expect(socialIcons.length).toBe(3);
    });

    it('should have target="_blank" on social links', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const socialIcons = compiled.querySelectorAll('.footer__social-icon') as NodeListOf<HTMLAnchorElement>;

      socialIcons.forEach(link => {
        expect(link.getAttribute('target')).toBe('_blank');
      });
    });

    it('should have rel="noopener noreferrer" on social links', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const socialIcons = compiled.querySelectorAll('.footer__social-icon') as NodeListOf<HTMLAnchorElement>;

      socialIcons.forEach(link => {
        expect(link.getAttribute('rel')).toBe('noopener noreferrer');
      });
    });

    it('should use correct LinkedIn URL from environment', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const linkedinLink = compiled.querySelector('.footer__social-icon') as HTMLAnchorElement;
      expect(linkedinLink.getAttribute('href')).toBe(environment.social.linkedin);
    });

    it('should have aria-label on social icons', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const socialIcons = compiled.querySelectorAll('.footer__social-icon') as NodeListOf<HTMLAnchorElement>;

      socialIcons.forEach(link => {
        expect(link.getAttribute('aria-label')).toBeTruthy();
      });
    });
  });

  describe('Copyright Text', () => {
    it('should display company name in copyright', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const copyright = compiled.querySelector('.footer__copyright');
      expect(copyright?.textContent).toContain('VelocityAI');
    });

    it('should display current year in copyright', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const copyright = compiled.querySelector('.footer__copyright');
      const currentYear = new Date().getFullYear();
      expect(copyright?.textContent).toContain(currentYear.toString());
    });

    it('should display "All rights reserved" text', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const copyright = compiled.querySelector('.footer__copyright');
      expect(copyright?.textContent).toContain('All rights reserved');
    });
  });

  describe('Brand Section', () => {
    it('should display brand name', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const logo = compiled.querySelector('.footer__logo');
      expect(logo?.textContent).toBe(FOOTER_BRAND.name);
    });

    it('should display brand tagline', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const tagline = compiled.querySelector('.footer__tagline');
      expect(tagline?.textContent).toBe(FOOTER_BRAND.tagline);
    });

    it('should display brand description', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const description = compiled.querySelector('.footer__description');
      expect(description?.textContent).toBe(FOOTER_BRAND.description);
    });
  });

  describe('Responsive Layout', () => {
    it('should have grid layout for columns', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const columns = compiled.querySelector('.footer__columns');
      expect(columns).toBeTruthy();
    });

    it('should have 4 footer columns', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const columns = compiled.querySelectorAll('.footer__column');
      expect(columns.length).toBe(4);
    });

    it('should have footer bottom section', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const bottom = compiled.querySelector('.footer__bottom');
      expect(bottom).toBeTruthy();
    });
  });
});
