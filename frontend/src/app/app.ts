import { Component } from '@angular/core';
import { ToastContainerComponent } from './shared/toast-container.component';
import { MainLayoutComponent } from './shared/main-layout.component';

@Component({
  selector: 'app-root',
  imports: [MainLayoutComponent, ToastContainerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
