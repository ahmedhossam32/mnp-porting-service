import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { OperatorSelectorComponent } from './operator-selector.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, OperatorSelectorComponent],
  template: `
    <div class="min-h-screen bg-gray-100">
      <header class="bg-gray-900 shadow-md">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center backdrop-blur-sm">
              <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h1 class="text-lg font-bold text-white">MNP Porting Service</h1>
              <p class="text-xs text-gray-400">Mobile Number Portability</p>
            </div>
          </div>
          <app-operator-selector />
        </div>
      </header>

      <nav class="bg-white border-b border-gray-200">
        <div class="max-w-5xl mx-auto px-4 sm:px-6">
          <div class="flex gap-1">
            <a
              routerLink="/create"
              routerLinkActive="border-indigo-600 text-indigo-600 font-semibold"
              class="px-4 py-3 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:text-gray-700 transition-colors"
            >
              New Request
            </a>
            <a
              routerLink="/requests"
              routerLinkActive="border-indigo-600 text-indigo-600 font-semibold"
              class="px-4 py-3 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:text-gray-700 transition-colors"
            >
              All Requests
            </a>
            <a
              routerLink="/status"
              routerLinkActive="border-indigo-600 text-indigo-600 font-semibold"
              class="px-4 py-3 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:text-gray-700 transition-colors"
            >
              Check Status
            </a>
          </div>
        </div>
      </nav>

      <main class="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <router-outlet />
      </main>
    </div>
  `
})
export class MainLayoutComponent {}
