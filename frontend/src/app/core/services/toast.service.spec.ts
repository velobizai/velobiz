import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastService } from './toast.service';
import { ToastComponent } from '../../shared/components/toast/toast.component';

describe('ToastService', () => {
  let service: ToastService;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('MatSnackBar', ['openFromComponent']);

    TestBed.configureTestingModule({
      providers: [
        ToastService,
        { provide: MatSnackBar, useValue: spy }
      ]
    });

    service = TestBed.inject(ToastService);
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ✅ Positive scenario: Show success toast
  it('should show success toast with correct configuration', () => {
    const message = 'Operation successful';
    service.success(message);

    expect(snackBarSpy.openFromComponent).toHaveBeenCalledWith(
      ToastComponent,
      jasmine.objectContaining({
        data: { message, type: 'success' },
        panelClass: ['toast-success'],
        duration: 3000
      })
    );
  });

  // ✅ Positive scenario: Show error toast
  it('should show error toast with correct configuration', () => {
    const message = 'Operation failed';
    service.error(message);

    expect(snackBarSpy.openFromComponent).toHaveBeenCalledWith(
      ToastComponent,
      jasmine.objectContaining({
        data: { message, type: 'error' },
        panelClass: ['toast-error'],
        duration: 3000
      })
    );
  });

  // ✅ Positive scenario: Show info toast
  it('should show info toast with correct configuration', () => {
    const message = 'Information message';
    service.info(message);

    expect(snackBarSpy.openFromComponent).toHaveBeenCalledWith(
      ToastComponent,
      jasmine.objectContaining({
        data: { message, type: 'info' },
        panelClass: ['toast-info'],
        duration: 3000
      })
    );
  });

  // ❌ Negative scenario: Show toast with custom duration
  it('should show toast with custom duration', () => {
    const message = 'Custom duration';
    const customDuration = 5000;
    service.success(message, customDuration);

    expect(snackBarSpy.openFromComponent).toHaveBeenCalledWith(
      ToastComponent,
      jasmine.objectContaining({
        duration: customDuration
      })
    );
  });

  // 🚫 Edge case: Show toast with empty message
  it('should show toast even with empty message', () => {
    service.info('');

    expect(snackBarSpy.openFromComponent).toHaveBeenCalledWith(
      ToastComponent,
      jasmine.objectContaining({
        data: { message: '', type: 'info' }
      })
    );
  });

  // 🚫 Edge case: Show toast with very long message
  it('should show toast with very long message', () => {
    const longMessage = 'A'.repeat(1000);
    service.error(longMessage);

    expect(snackBarSpy.openFromComponent).toHaveBeenCalledWith(
      ToastComponent,
      jasmine.objectContaining({
        data: { message: longMessage, type: 'error' }
      })
    );
  });
});
