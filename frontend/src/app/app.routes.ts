import { Routes } from '@angular/router';
import { CreateRequestComponent } from './create-request/create-request.component';
import { RequestListComponent } from './request-list/request-list.component';
import { PhoneStatusComponent } from './phone-status/phone-status.component';

export const routes: Routes = [
  { path: 'create', component: CreateRequestComponent },
  { path: 'requests', component: RequestListComponent },
  { path: 'status', component: PhoneStatusComponent },
  { path: '', redirectTo: 'create', pathMatch: 'full' }
];
