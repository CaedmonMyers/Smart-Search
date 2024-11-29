import { Routes } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { ResultComponent } from './result/result.component';
import { SettingsComponent } from './settings/settings.component';

export const routes: Routes = [
  { path: '', component: SearchComponent },
  { path: 'result/:id', component: ResultComponent },
  { path: 'search/:query', component: SearchComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'settings/:apiKey', component: SearchComponent }
];