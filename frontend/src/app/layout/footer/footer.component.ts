import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import {
  FOOTER_QUICK_LINKS,
  FOOTER_COMPANY_LINKS,
  FOOTER_LEGAL_LINKS,
  FOOTER_BRAND,
  NavLink
} from '../layout.config';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  quickLinks: NavLink[] = FOOTER_QUICK_LINKS;
  companyLinks: NavLink[] = FOOTER_COMPANY_LINKS;
  legalLinks: NavLink[] = FOOTER_LEGAL_LINKS;
  brand = FOOTER_BRAND;
  currentYear = new Date().getFullYear();
  socialLinks = environment.social;
}
