# Skill: Design System — Tailwind CSS Component Library

## Purpose
Reusable UI component patterns using Tailwind CSS for consistent design across the application.

## Color Palette
```css
/* Primary */    bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500
/* Secondary */  bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500
/* Success */    bg-green-50 text-green-800 border-green-200
/* Warning */    bg-yellow-50 text-yellow-800 border-yellow-200
/* Error */      bg-red-50 text-red-800 border-red-200
/* Info */       bg-blue-50 text-blue-800 border-blue-200
/* Neutral */    bg-gray-50 text-gray-600 border-gray-200
```

## Component Patterns

### Button Variants
```html
<!-- Primary -->
<button class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
  Save Changes
</button>

<!-- Secondary -->
<button class="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
  Cancel
</button>

<!-- Destructive -->
<button class="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors">
  Delete
</button>
```

### Form Input
```html
<div>
  <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
  <input id="name" type="text"
    class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
    placeholder="Enter name" />
  <!-- Error state -->
  <p class="mt-1 text-xs text-red-600">Name is required</p>
</div>
```

### Data Table
```html
<div class="overflow-hidden rounded-lg border border-gray-200">
  <table class="min-w-full divide-y divide-gray-200">
    <thead class="bg-gray-50">
      <tr>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
        <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
      </tr>
    </thead>
    <tbody class="bg-white divide-y divide-gray-200">
      <tr class="hover:bg-gray-50 transition-colors">
        <td class="px-6 py-4 text-sm text-gray-900">Item Name</td>
        <td class="px-6 py-4"><span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Active</span></td>
        <td class="px-6 py-4 text-right text-sm"><!-- action buttons --></td>
      </tr>
    </tbody>
  </table>
</div>
```

### Empty State
```html
<div class="text-center py-12">
  <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
  </svg>
  <h3 class="mt-4 text-sm font-semibold text-gray-900">No items found</h3>
  <p class="mt-1 text-sm text-gray-500">Get started by creating your first item.</p>
  <button class="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
    Create Item
  </button>
</div>
```

### Loading Skeleton
```html
<div class="animate-pulse space-y-4">
  <div class="h-4 bg-gray-200 rounded w-3/4"></div>
  <div class="h-4 bg-gray-200 rounded w-1/2"></div>
  <div class="h-32 bg-gray-200 rounded"></div>
</div>
```

### Toast Notification
```html
<!-- Success -->
<div class="fixed bottom-4 right-4 flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-200 rounded-lg shadow-lg" role="alert">
  <svg class="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
  </svg>
  <span class="text-sm font-medium text-green-800">Item created successfully</span>
</div>
```

## Responsive Breakpoints
| Breakpoint | Min Width | Usage |
|-----------|-----------|-------|
| `sm:` | 640px | Small tablets |
| `md:` | 768px | Tablets |
| `lg:` | 1024px | Laptops |
| `xl:` | 1280px | Desktops |
| `2xl:` | 1536px | Large screens |

## Spacing Scale
4px grid: `1`=4px, `2`=8px, `3`=12px, `4`=16px, `6`=24px, `8`=32px, `12`=48px, `16`=64px
