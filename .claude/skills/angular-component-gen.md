# Skill: Angular Component Generation (Angular 19+ / Material 3+)

## Purpose
Generate Angular 19+ standalone components with Angular Material 3 following project conventions and best practices.

## Template: Smart Component (Container)
```typescript
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { {{FeatureName}}Service } from '../services/{{feature-name}}.service';

@Component({
  selector: 'app-{{feature-name}}-container',
  standalone: true,
  imports: [
    MatTableModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isLoading()) {
      <div class="flex justify-center p-8">
        <mat-spinner diameter="40" />
      </div>
    } @else if (error()) {
      <div class="text-center p-8">
        <mat-icon class="text-red-500 mb-2" fontIcon="error" />
        <p class="text-sm text-gray-600">{{ error() }}</p>
        <button mat-stroked-button (click)="loadData()">
          <mat-icon fontIcon="refresh" /> Retry
        </button>
      </div>
    } @else if (items().length === 0) {
      <div class="text-center p-8">
        <mat-icon class="text-gray-400 mb-2" fontIcon="inbox" />
        <p class="text-sm text-gray-500">No items found</p>
        <button mat-flat-button color="primary" (click)="onCreate()">
          <mat-icon fontIcon="add" /> Create First Item
        </button>
      </div>
    } @else {
      @for (item of items(); track item.id) {
        <app-{{feature-name}}-card
          [item]="item"
          (edit)="onEdit($event)"
          (delete)="onDelete($event)" />
      }
    }
  `
})
export class {{FeatureName}}ContainerComponent implements OnInit {
  private readonly service = inject({{FeatureName}}Service);

  items = this.service.items;
  isLoading = this.service.isLoading;
  error = this.service.error;

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.service.loadItems();
  }

  onCreate(): void { /* navigate to create */ }
  onEdit(item: {{ItemType}}): void { /* navigate to edit */ }
  onDelete(item: {{ItemType}}): void { /* confirm and delete */ }
}
```

## Template: Dumb Component (Presentational)
```typescript
import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-{{feature-name}}-card',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatChipsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card appearance="outlined" class="mb-4">
      <mat-card-header>
        <mat-card-title>{{ item().name }}</mat-card-title>
        <mat-card-subtitle>{{ item().description }}</mat-card-subtitle>
      </mat-card-header>
      <mat-card-actions align="end">
        <button mat-button (click)="edit.emit(item())">
          Edit
        </button>
        <button mat-button color="warn" (click)="delete.emit(item())">
          Delete
        </button>
      </mat-card-actions>
    </mat-card>
  `
})
export class {{FeatureName}}CardComponent {
  item = input.required<{{ItemType}}>();  // Signal-based input (Angular 19+)
  edit = output<{{ItemType}}>();          // Signal-based output
  delete = output<{{ItemType}}>();
}
```

## Template: Service with Signals + httpResource (Angular 19+)
```typescript
import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class {{FeatureName}}Service {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/api/v1/{{feature-name}}s`;

  // --- Signal-based state ---
  private readonly _items = signal<{{ItemType}}[]>([]);
  private readonly _isLoading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly items = this._items.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly itemCount = computed(() => this._items().length);

  // --- Declarative httpResource (Angular 19+) for simple fetching ---
  // itemsResource = httpResource<ApiResponse<{{ItemType}}[]>>(() => ({
  //   url: this.baseUrl,
  // }));

  // --- Imperative approach for load/create/update/delete ---
  loadItems(): void {
    this._isLoading.set(true);
    this._error.set(null);
    this.http.get<ApiResponse<{{ItemType}}[]>>(this.baseUrl).subscribe({
      next: (response) => {
        this._items.set(response.data);
        this._isLoading.set(false);
      },
      error: (err) => {
        this._error.set(err.message || 'Failed to load items');
        this._isLoading.set(false);
      }
    });
  }
}
```

## Variables to Replace
- `{{FeatureName}}` — PascalCase feature name (e.g., `HealthCheck`)
- `{{feature-name}}` — kebab-case feature name (e.g., `health-check`)
- `{{ItemType}}` — TypeScript interface name (e.g., `HealthCheckResult`)
