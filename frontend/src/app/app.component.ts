import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { ChatWidgetComponent } from './shared/components/chat-widget/chat-widget.component';
import { BackToTopComponent } from './shared/components/back-to-top/back-to-top.component';
import { ProgressBarComponent } from './shared/components/progress-bar/progress-bar.component';
import { CookieConsentComponent } from './shared/components/cookie-consent/cookie-consent.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    ChatWidgetComponent,
    BackToTopComponent,
    ProgressBarComponent,
    CookieConsentComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
}
