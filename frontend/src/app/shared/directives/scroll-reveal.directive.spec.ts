import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ScrollRevealDirective } from './scroll-reveal.directive';

@Component({
  template: '<div appScrollReveal>Test Content</div>',
  standalone: true,
  imports: [ScrollRevealDirective]
})
class TestComponent {}

describe('ScrollRevealDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let directiveElement: DebugElement;
  let nativeElement: HTMLElement;
  let mockObserver: jasmine.SpyObj<IntersectionObserver>;
  let observerCallback: IntersectionObserverCallback;

  beforeEach(() => {
    // Mock IntersectionObserver
    mockObserver = jasmine.createSpyObj('IntersectionObserver', ['observe', 'disconnect']);

    class MockIntersectionObserver implements IntersectionObserver {
      readonly root: Element | null = null;
      readonly rootMargin: string = '';
      readonly thresholds: ReadonlyArray<number> = [];

      constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
        observerCallback = callback;
        Object.assign(this, mockObserver);
      }

      observe = mockObserver.observe;
      disconnect = mockObserver.disconnect;
      unobserve = jasmine.createSpy('unobserve');
      takeRecords = jasmine.createSpy('takeRecords').and.returnValue([]);
    }

    (window as any).IntersectionObserver = MockIntersectionObserver;

    TestBed.configureTestingModule({
      imports: [TestComponent]
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    directiveElement = fixture.debugElement.query(By.directive(ScrollRevealDirective));
    nativeElement = directiveElement.nativeElement;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create directive', () => {
    expect(directiveElement).toBeTruthy();
  });

  // ✅ Positive scenario: Apply initial hidden styles
  it('should apply initial hidden styles on init', () => {
    expect(nativeElement.style.opacity).toBe('0');
    expect(nativeElement.style.transform).toBe('translateY(30px)');
    expect(nativeElement.style.transition).toContain('opacity');
    expect(nativeElement.style.transition).toContain('transform');
  });

  // ✅ Positive scenario: Create IntersectionObserver on init
  it('should create IntersectionObserver on init', () => {
    expect(mockObserver.observe).toHaveBeenCalledWith(nativeElement);
  });

  // ✅ Positive scenario: Reveal element when intersecting
  it('should reveal element when IntersectionObserver detects intersection', () => {
    // Simulate intersection
    const mockEntries = [{
      isIntersecting: true,
      target: nativeElement,
      boundingClientRect: {} as DOMRectReadOnly,
      intersectionRatio: 0.5,
      intersectionRect: {} as DOMRectReadOnly,
      rootBounds: null,
      time: Date.now()
    }] as IntersectionObserverEntry[];

    observerCallback(mockEntries, mockObserver);

    // Check if reveal styles are applied
    expect(nativeElement.style.opacity).toBe('1');
    expect(nativeElement.style.transform).toBe('translateY(0px)');
  });

  // ❌ Negative scenario: Do not reveal when not intersecting
  it('should not reveal element when not intersecting', () => {
    const mockEntries = [{
      isIntersecting: false,
      target: nativeElement,
      boundingClientRect: {} as DOMRectReadOnly,
      intersectionRatio: 0,
      intersectionRect: {} as DOMRectReadOnly,
      rootBounds: null,
      time: Date.now()
    }] as IntersectionObserverEntry[];

    observerCallback(mockEntries, mockObserver);

    // Element should remain hidden
    expect(nativeElement.style.opacity).toBe('0');
    expect(nativeElement.style.transform).toBe('translateY(30px)');
  });

  // ✅ Positive scenario: Disconnect observer after revealing
  it('should disconnect observer after revealing element', () => {
    const mockEntries = [{
      isIntersecting: true,
      target: nativeElement,
      boundingClientRect: {} as DOMRectReadOnly,
      intersectionRatio: 0.5,
      intersectionRect: {} as DOMRectReadOnly,
      rootBounds: null,
      time: Date.now()
    }] as IntersectionObserverEntry[];

    observerCallback(mockEntries, mockObserver);

    expect(mockObserver.disconnect).toHaveBeenCalled();
  });

  // 🚫 Edge case: Disconnect observer on destroy
  it('should disconnect observer on component destroy', () => {
    fixture.destroy();
    expect(mockObserver.disconnect).toHaveBeenCalled();
  });

  // 🚫 Edge case: Multiple elements with directive
  it('should work with multiple elements', () => {
    @Component({
      template: `
        <div appScrollReveal>Element 1</div>
        <div appScrollReveal>Element 2</div>
      `,
      standalone: true,
      imports: [ScrollRevealDirective]
    })
    class MultipleElementsComponent {}

    const multiFixture = TestBed.createComponent(MultipleElementsComponent);
    multiFixture.detectChanges();

    const elements = multiFixture.debugElement.queryAll(By.directive(ScrollRevealDirective));
    expect(elements.length).toBe(2);

    elements.forEach((element) => {
      expect(element.nativeElement.style.opacity).toBe('0');
      expect(element.nativeElement.style.transform).toBe('translateY(30px)');
    });

    multiFixture.destroy();
  });
});
