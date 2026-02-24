import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IndustriesComponent } from './industries.component';

describe('IndustriesComponent', () => {
  let component: IndustriesComponent;
  let fixture: ComponentFixture<IndustriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndustriesComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(IndustriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render industries section', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const section = compiled.querySelector('.industries-section');
    expect(section).toBeTruthy();
  });

  it('should render section heading', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const heading = compiled.querySelector('.section-heading');
    expect(heading?.textContent).toContain('Industries We Serve');
  });

  it('should render 8 industry tiles', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const tiles = compiled.querySelectorAll('.industry-tile');
    expect(tiles.length).toBe(8);
  });

  it('should have correct industry names', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const names = Array.from(compiled.querySelectorAll('.industry-name')).map(el => el.textContent);
    expect(names).toContain('Healthcare');
    expect(names).toContain('Financial Services');
    expect(names).toContain('E-Commerce');
    expect(names).toContain('Real Estate');
    expect(names).toContain('Professional Services');
    expect(names).toContain('Education');
    expect(names).toContain('Manufacturing');
    expect(names).toContain('Logistics');
  });

  it('should render industry icons', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const icons = compiled.querySelectorAll('.industry-icon');
    expect(icons.length).toBe(8);
    expect(icons[0].textContent).toBeTruthy();
  });

  it('should have industries grid layout', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const grid = compiled.querySelector('.industries-grid');
    expect(grid).toBeTruthy();
  });

  it('should have ScrollRevealDirective applied', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const section = compiled.querySelector('[appScrollReveal]');
    expect(section).toBeTruthy();
  });

  it('should have proper heading hierarchy', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const h2 = compiled.querySelector('h2#industries-heading');
    expect(h2).toBeTruthy();
  });

  it('should have aria-labelledby on industries section', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const section = compiled.querySelector('section.industries-section');
    expect(section?.getAttribute('aria-labelledby')).toBe('industries-heading');
  });

  it('should have 8 industries in component data', () => {
    expect(component.industries.length).toBe(8);
  });

  it('should have correct industry data structure', () => {
    const firstIndustry = component.industries[0];
    expect(firstIndustry.icon).toBeTruthy();
    expect(firstIndustry.name).toBe('Healthcare');
  });

  it('should have hover effect class on tiles', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const firstTile = compiled.querySelector('.industry-tile');
    expect(firstTile?.classList.contains('industry-tile')).toBe(true);
  });
});
