import { Component, HostListener, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NAV_LINKS, NavLink } from '../layout.config';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatIconModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent implements OnInit {
  navLinks: NavLink[] = NAV_LINKS;
  scrolled = signal<boolean>(false);
  menuOpen = signal<boolean>(false);

  private lastScrollTime = 0;
  private readonly debounceDelay = 50;

  ngOnInit(): void {
    this.updateScrollState();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    const currentTime = Date.now();
    if (currentTime - this.lastScrollTime >= this.debounceDelay) {
      this.lastScrollTime = currentTime;
      this.updateScrollState();
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.menuOpen()) {
      this.closeMenu();
    }
  }

  private updateScrollState(): void {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || 0;
    this.scrolled.set(scrollPosition > 100);
  }

  toggleMenu(): void {
    this.menuOpen.set(!this.menuOpen());
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}
