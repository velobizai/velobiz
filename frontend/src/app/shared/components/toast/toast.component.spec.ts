import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { ToastComponent } from './toast.component';
import { ToastData } from '../../../core/services/toast.service';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;
  let snackBarRefSpy: jasmine.SpyObj<MatSnackBarRef<ToastComponent>>;

  const createComponent = (data: ToastData) => {
    snackBarRefSpy = jasmine.createSpyObj('MatSnackBarRef', ['dismiss']);

    TestBed.configureTestingModule({
      imports: [ToastComponent],
      providers: [
        { provide: MAT_SNACK_BAR_DATA, useValue: data },
        { provide: MatSnackBarRef, useValue: snackBarRefSpy }
      ]
    });

    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  afterEach(() => {
    fixture?.destroy();
  });

  // ✅ Positive scenario: Render success toast
  it('should create component with success type', () => {
    createComponent({ message: 'Success message', type: 'success' });
    expect(component).toBeTruthy();
    expect(component.data.type).toBe('success');
    expect(component.data.message).toBe('Success message');
  });

  // ✅ Positive scenario: Display correct icon for success
  it('should display check_circle icon for success type', () => {
    createComponent({ message: 'Success', type: 'success' });
    expect(component.icon).toBe('check_circle');
  });

  // ✅ Positive scenario: Display correct icon for error
  it('should display error icon for error type', () => {
    createComponent({ message: 'Error', type: 'error' });
    expect(component.icon).toBe('error');
  });

  // ✅ Positive scenario: Display correct icon for info
  it('should display info icon for info type', () => {
    createComponent({ message: 'Info', type: 'info' });
    expect(component.icon).toBe('info');
  });

  // ✅ Positive scenario: Dismiss toast when close button clicked
  it('should dismiss toast when dismiss() is called', () => {
    createComponent({ message: 'Test', type: 'info' });
    component.dismiss();
    expect(snackBarRefSpy.dismiss).toHaveBeenCalled();
  });

  // ❌ Negative scenario: Render message content correctly
  it('should render the message content in the template', () => {
    const message = 'Test notification message';
    createComponent({ message, type: 'info' });

    const compiled = fixture.nativeElement as HTMLElement;
    const messageElement = compiled.querySelector('.toast-message');
    expect(messageElement?.textContent).toBe(message);
  });

  // 🚫 Edge case: Handle empty message
  it('should handle empty message gracefully', () => {
    createComponent({ message: '', type: 'success' });
    expect(component.data.message).toBe('');

    const compiled = fixture.nativeElement as HTMLElement;
    const messageElement = compiled.querySelector('.toast-message');
    expect(messageElement?.textContent).toBe('');
  });

  // 🚫 Edge case: Apply correct CSS class based on type
  it('should apply correct CSS class for each toast type', () => {
    createComponent({ message: 'Error test', type: 'error' });

    const compiled = fixture.nativeElement as HTMLElement;
    const container = compiled.querySelector('.toast-container');
    expect(container?.classList.contains('toast-error')).toBe(true);
  });

  // 🚫 Edge case: Close button should be present
  it('should render close button', () => {
    createComponent({ message: 'Test', type: 'info' });

    const compiled = fixture.nativeElement as HTMLElement;
    const closeButton = compiled.querySelector('.toast-close');
    expect(closeButton).toBeTruthy();
  });
});
