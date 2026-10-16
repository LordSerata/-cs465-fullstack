import { InjectionToken } from '@angular/core';

// Wraps localStorage so the app doesn't touch the browser directly.
// This makes it easy to swap in fake storage for tests.
export const BROWSER_STORAGE = new InjectionToken<Storage>('Browser Storage', {
  providedIn: 'root',
  factory: () => localStorage
});
