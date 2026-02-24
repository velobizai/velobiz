import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProcessComponent } from './process.component';

describe('ProcessComponent', () => {
  let component: ProcessComponent;
  let fixture: ComponentFixture<ProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcessComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render process section', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const processSection = compiled.querySelector('.process-section');
    expect(processSection).toBeTruthy();
  });

  it('should render section heading', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const heading = compiled.querySelector('.section-heading');
    expect(heading?.textContent).toContain('How It Works');
  });

  it('should render 4 process steps', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const steps = compiled.querySelectorAll('.process-step');
    expect(steps.length).toBe(4);
  });

  it('should render step numbers correctly', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const stepNumbers = Array.from(compiled.querySelectorAll('.step-number')).map(el => el.textContent?.trim());
    expect(stepNumbers).toEqual(['1', '2', '3', '4']);
  });

  it('should have correct step titles', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const titles = Array.from(compiled.querySelectorAll('.step-title')).map(el => el.textContent);
    expect(titles).toContain('Discovery Call');
    expect(titles).toContain('Custom Design');
    expect(titles).toContain('Integration');
    expect(titles).toContain('Optimization');
  });

  it('should render step descriptions', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const descriptions = compiled.querySelectorAll('.step-description');
    expect(descriptions.length).toBe(4);
    expect(descriptions[0].textContent).toContain('workflow');
  });

  it('should have timeline connector element', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const timeline = compiled.querySelector('.process-timeline');
    expect(timeline).toBeTruthy();
  });

  it('should have ScrollRevealDirective applied', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const section = compiled.querySelector('[appScrollReveal]');
    expect(section).toBeTruthy();
  });

  it('should have proper heading hierarchy', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const h2 = compiled.querySelector('h2#process-heading');
    const h3s = compiled.querySelectorAll('h3.step-title');
    expect(h2).toBeTruthy();
    expect(h3s.length).toBe(4);
  });

  it('should have aria-labelledby on process section', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const section = compiled.querySelector('section.process-section');
    expect(section?.getAttribute('aria-labelledby')).toBe('process-heading');
  });

  it('should have 4 steps in component data', () => {
    expect(component.steps.length).toBe(4);
  });

  it('should have correct step data structure', () => {
    const firstStep = component.steps[0];
    expect(firstStep.number).toBe(1);
    expect(firstStep.title).toBe('Discovery Call');
    expect(firstStep.description).toBeTruthy();
  });
});
