import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './chat-widget.component.html',
  styleUrls: ['./chat-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatWidgetComponent {
  isOpen = signal<boolean>(false);
  isMinimized = signal<boolean>(false);
  messages = signal<ChatMessage[]>([
    {
      id: '1',
      text: 'Hi! 👋 I\'m your AI assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  messageInput = signal<string>('');
  isTyping = signal<boolean>(false);

  toggleChat(): void {
    if (this.isMinimized()) {
      this.isMinimized.set(false);
    } else {
      this.isOpen.update(open => !open);
    }
  }

  minimizeChat(): void {
    this.isMinimized.set(true);
  }

  closeChat(): void {
    this.isOpen.set(false);
    this.isMinimized.set(false);
  }

  sendMessage(): void {
    const text = this.messageInput().trim();
    if (!text) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };

    this.messages.update(msgs => [...msgs, userMessage]);
    this.messageInput.set('');

    // Simulate bot response
    this.isTyping.set(true);
    setTimeout(() => {
      const botResponse = this.getBotResponse(text);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      this.messages.update(msgs => [...msgs, botMessage]);
      this.isTyping.set(false);
    }, 1500);
  }

  private getBotResponse(userText: string): string {
    const lowerText = userText.toLowerCase();

    if (lowerText.includes('pricing') || lowerText.includes('cost') || lowerText.includes('price')) {
      return 'Our pricing starts at $999/month for the Starter plan. Would you like me to connect you with our sales team for a custom quote?';
    }

    if (lowerText.includes('demo') || lowerText.includes('trial')) {
      return 'Great! We offer a 30-day free trial. I can help you get started. What\'s your email address?';
    }

    if (lowerText.includes('contact') || lowerText.includes('talk') || lowerText.includes('call')) {
      return 'I\'d be happy to connect you with our team! You can schedule a call at /contact or I can have someone reach out. What works best for you?';
    }

    if (lowerText.includes('services') || lowerText.includes('what do you do')) {
      return 'We specialize in AI automation including customer support bots, sales automation, data processing, workflow automation, and voice AI agents. Which area interests you most?';
    }

    return 'That\'s a great question! For detailed information, I recommend checking our FAQ page or speaking with our team directly. Would you like me to connect you with a specialist?';
  }

  handleKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}
