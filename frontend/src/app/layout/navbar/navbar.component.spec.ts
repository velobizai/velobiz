import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './navbar.component';
import { NAV_LINKS } from '../layout.config';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent, NoopAnimationsModule],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize scrolled signal to false', () => {
      expect(component.scrolled()).toBe(false);
    });

    it('should initialize menuOpen signal to false', () => {
      expect(component.menuOpen()).toBe(false);
    });

    it('should load navigation links from config', () => {
      expect(component.navLinks).toEqual(NAV_LINKS);
    });

    it('should have exactly 5 navigation links', () => {
      expect(component.navLinks.length).toBe(5);
    });
  });

  describe('Scroll Detection', () => {
    it('should set scrolled to true when scrolling past 100px', (done) => {
      Object.defineProperty(window, 'pageYOffset', {
        writable: true,
        configurable: true,
        value: 150
      });

      window.dispatchEvent(new Event('scroll'));

      setTimeout(() => {
        expect(component.scrolled()).toBe(true);
        done();
      }, 100);
    });

    it('should set scrolled to false when scrolling back to top', (done) => {
      component.scrolled.set(true);
      expect(component.scrolled()).toBe(true);

      Object.defineProperty(window, 'pageYOffset', {
        writable: true,
        configurable: true,
        value: 50
      });

      window.dispatchEvent(new Event('scroll'));

      setTimeout(() => {
        expect(component.scrolled()).toBe(false);
        done();
      }, 100);
    });

    it('should set scrolled to true at exactly 100px', (done) => {
      Object.defineProperty(window, 'pageYOffset', {
        writable: true,
        configurable: true,
        value: 100
      });

      window.dispatchEvent(new Event('scroll'));

      setTimeout(() => {
        expect(component.scrolled()).toBe(false);
        done();
      }, 100);
    });

    it('should keep scrolled false at 99px', (done) => {
      Object.defineProperty(window, 'pageYOffset', {
        writable: true,
        configurable: true,
        value: 99
      });

      window.dispatchEvent(new Event('scroll'));

      setTimeout(() => {
        expect(component.scrolled()).toBe(false);
        done();
      }, 100);
    });

    it('should not break on NaN scroll position', () => {
      Object.defineProperty(window, 'pageYOffset', {
        writable: true,
        configurable: true,
        value: NaN
      });

      expect(() => {
        window.dispatchEvent(new Event('scroll'));
      }).not.toThrow();
    });
  });

  describe('Mobile Menu Interactions', () => {
    it('should toggle menuOpen from false to true', () => {
      expect(component.menuOpen()).toBe(false);
      component.toggleMenu();
      expect(component.menuOpen()).toBe(true);
    });

    it('should toggle menuOpen from true to false', () => {
      component.menuOpen.set(true);
      expect(component.menuOpen()).toBe(true);
      component.toggleMenu();
      expect(component.menuOpen()).toBe(false);
    });

    it('should set menuOpen to false when closeMenu is called', () => {
      component.menuOpen.set(true);
      component.closeMenu();
      expect(component.menuOpen()).toBe(false);
    });

    it('should close menu when Escape key is pressed', () => {
      component.menuOpen.set(true);
      expect(component.menuOpen()).toBe(true);

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(event);

      expect(component.menuOpen()).toBe(false);
    });
  });

  describe('Router Navigation', () => {
    it('should have logo link with correct route', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const logoLink = compiled.querySelector('.navbar__logo') as HTMLAnchorElement;
      expect(logoLink).toBeTruthy();
    });

    it('should have CTA button routing to /contact', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const ctaButton = compiled.querySelector('.navbar__cta--desktop') as HTMLAnchorElement;
      expect(ctaButton).toBeTruthy();
    });

    it('should render all navigation links', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const navLinks = compiled.querySelectorAll('.navbar__nav-link');
      expect(navLinks.length).toBe(5);
    });
  });

  describe('Accessibility Attributes', () => {
    it('should have aria-label on hamburger button', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const hamburger = compiled.querySelector('.navbar__hamburger') as HTMLButtonElement;
      expect(hamburger.getAttribute('aria-label')).toBe('Open navigation menu');
    });

    it('should have aria-expanded="false" initially on hamburger', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const hamburger = compiled.querySelector('.navbar__hamburger') as HTMLButtonElement;
      expect(hamburger.getAttribute('aria-expanded')).toBe('false');
    });

    it('should update aria-expanded when menu opens', () => {
      component.menuOpen.set(true);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const hamburger = compiled.querySelector('.navbar__hamburger') as HTMLButtonElement;
      expect(hamburger.getAttribute('aria-expanded')).toBe('true');
    });

    it('should have role="navigation" on mobile drawer', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const drawer = compiled.querySelector('mat-sidenav');
      expect(drawer?.getAttribute('role')).toBe('navigation');
    });
  });

  describe('Responsive Display', () => {
    it('should have desktop navigation', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const desktopNav = compiled.querySelector('.navbar__nav-list--desktop');
      expect(desktopNav).toBeTruthy();
    });

    it('should have hamburger button for mobile', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const hamburger = compiled.querySelector('.navbar__hamburger');
      expect(hamburger).toBeTruthy();
    });
  });
});
