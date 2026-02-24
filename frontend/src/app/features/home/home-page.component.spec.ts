import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePageComponent } from './home-page.component';
import { HeroComponent } from './hero/hero.component';
import { StatsBarComponent } from './stats-bar/stats-bar.component';
import { ProcessComponent } from './process/process.component';
import { IndustriesComponent } from './industries/industries.component';
import { CtaBannerComponent } from './cta-banner/cta-banner.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HomePageComponent,
        HeroComponent,
        StatsBarComponent,
        ProcessComponent,
        IndustriesComponent,
        CtaBannerComponent,
        RouterTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render main element with home-page class', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const mainElement = compiled.querySelector('main.home-page');
    expect(mainElement).toBeTruthy();
  });

  it('should render all 5 section components', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-hero')).toBeTruthy();
    expect(compiled.querySelector('app-stats-bar')).toBeTruthy();
    expect(compiled.querySelector('app-process')).toBeTruthy();
    expect(compiled.querySelector('app-industries')).toBeTruthy();
    expect(compiled.querySelector('app-cta-banner')).toBeTruthy();
  });
});
