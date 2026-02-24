import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingSpinnerComponent } from './loading-spinner.component';
import { By } from '@angular/platform-browser';

describe('LoadingSpinnerComponent', () => {
  let component: LoadingSpinnerComponent;
  let fixture: ComponentFixture<LoadingSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingSpinnerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ✅ Positive scenario: Render spinner with default size
  it('should render spinner with medium size by default', () => {
    expect(component.size).toBe('medium');
    expect(component.spinnerDiameter).toBe(48);
  });

  // ✅ Positive scenario: Render spinner with small size
  it('should render spinner with small size when specified', () => {
    component.size = 'small';
    expect(component.spinnerDiameter).toBe(32);
  });

  // ✅ Positive scenario: Render spinner with large size
  it('should render spinner with large size when specified', () => {
    component.size = 'large';
    expect(component.spinnerDiameter).toBe(64);
  });

  // ✅ Positive scenario: Render inline spinner by default
  it('should render inline spinner when overlay is false', () => {
    component.overlay = false;
    fixture.detectChanges();

    const inlineSpinner = fixture.debugElement.query(By.css('.spinner-inline'));
    const overlaySpinner = fixture.debugElement.query(By.css('.spinner-overlay'));

    expect(inlineSpinner).toBeTruthy();
    expect(overlaySpinner).toBeNull();
  });

  // ✅ Positive scenario: Render overlay spinner
  it('should render overlay spinner when overlay is true', () => {
    component.overlay = true;
    fixture.detectChanges();

    const overlaySpinner = fixture.debugElement.query(By.css('.spinner-overlay'));
    const inlineSpinner = fixture.debugElement.query(By.css('.spinner-inline'));

    expect(overlaySpinner).toBeTruthy();
    expect(inlineSpinner).toBeNull();
  });

  // ✅ Positive scenario: Display message when provided
  it('should display message when provided', () => {
    const message = 'Loading data...';
    component.message = message;
    fixture.detectChanges();

    const messageElement = fixture.debugElement.query(By.css('.spinner-message'));
    expect(messageElement).toBeTruthy();
    expect(messageElement.nativeElement.textContent).toBe(message);
  });

  // ❌ Negative scenario: Do not display message when not provided
  it('should not display message element when message is not provided', () => {
    component.message = undefined;
    fixture.detectChanges();

    const messageElement = fixture.debugElement.query(By.css('.spinner-message'));
    expect(messageElement).toBeNull();
  });

  // 🚫 Edge case: Handle empty message
  it('should handle empty message string', () => {
    component.message = '';
    fixture.detectChanges();

    const messageElement = fixture.debugElement.query(By.css('.spinner-message'));
    expect(messageElement).toBeNull();
  });

  // 🚫 Edge case: Apply correct CSS class for size
  it('should apply correct CSS class for spinner size', () => {
    component.size = 'small';
    component.overlay = false;
    fixture.detectChanges();

    const inlineSpinner = fixture.debugElement.query(By.css('.spinner-inline'));
    expect(inlineSpinner.nativeElement.classList.contains('spinner-small')).toBe(true);
  });

  // 🚫 Edge case: Material spinner should be present
  it('should render mat-spinner component', () => {
    const spinner = fixture.debugElement.query(By.css('mat-spinner'));
    expect(spinner).toBeTruthy();
  });

  // 🚫 Edge case: Overlay should have fixed positioning
  it('should have fixed positioning when overlay mode is enabled', () => {
    component.overlay = true;
    fixture.detectChanges();

    const overlayElement = fixture.debugElement.query(By.css('.spinner-overlay'));
    const styles = window.getComputedStyle(overlayElement.nativeElement);
    expect(styles.position).toBe('fixed');
  });
});
