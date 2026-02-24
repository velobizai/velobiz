import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { StatsBarComponent } from './stats-bar.component';

describe('StatsBarComponent', () => {
  let component: StatsBarComponent;
  let fixture: ComponentFixture<StatsBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsBarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(StatsBarComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render stats bar section', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const statsBar = compiled.querySelector('.stats-bar');
    expect(statsBar).toBeTruthy();
  });

  it('should render 4 stat items', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const statItems = compiled.querySelectorAll('.stat-item');
    expect(statItems.length).toBe(4);
  });

  it('should have correct stat labels', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const labels = Array.from(compiled.querySelectorAll('.stat-label')).map(el => el.textContent);
    expect(labels).toContain('Clients Served');
    expect(labels).toContain('Hours Saved');
    expect(labels).toContain('Uptime Guarantee');
    expect(labels).toContain('Support Availability');
  });

  it('should have hasAnimated signal initialized to false', () => {
    expect(component.hasAnimated()).toBe(false);
  });

  it('should format large numbers with M suffix', () => {
    const stat = { id: 'hours', value: 2000000, suffix: '+', label: 'Hours Saved', format: 'M' as const };
    component.animatedValues.update(() => new Map([['hours', 2000000]]));
    const formatted = component.getAnimatedValue(stat);
    expect(formatted).toBe('2.0M');
  });

  it('should format numbers without suffix when no format specified', () => {
    const stat = { id: 'clients', value: 500, suffix: '+', label: 'Clients Served' };
    component.animatedValues.update(() => new Map([['clients', 500]]));
    const formatted = component.getAnimatedValue(stat);
    expect(formatted).toBe('500');
  });

  it('should return 0 when animated value is not set', () => {
    const stat = { id: 'test', value: 100, suffix: '+', label: 'Test' };
    const formatted = component.getAnimatedValue(stat);
    expect(formatted).toBe('0');
  });

  it('should have hidden heading for screen readers', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const hiddenHeading = compiled.querySelector('h2.sr-only');
    expect(hiddenHeading).toBeTruthy();
    expect(hiddenHeading?.textContent).toContain('Our Track Record');
  });

  it('should set up IntersectionObserver on init', () => {
    const observeSpy = spyOn(IntersectionObserver.prototype, 'observe');
    fixture.detectChanges();
    expect(observeSpy).toHaveBeenCalled();
  });

  it('should disconnect observer on destroy', () => {
    const disconnectSpy = spyOn(IntersectionObserver.prototype, 'disconnect');
    fixture.detectChanges();
    component.ngOnDestroy();
    expect(disconnectSpy).toHaveBeenCalled();
  });

  it('should have aria-labelledby on stats bar section', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const statsBar = compiled.querySelector('.stats-bar');
    expect(statsBar?.getAttribute('aria-labelledby')).toBe('stats-heading');
  });
});
