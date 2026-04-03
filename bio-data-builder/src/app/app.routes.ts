import { Routes } from '@angular/router';
import { BioDataBuilderComponent } from './biodata-builder/biodata-builder.component';

export const routes: Routes = [
  { path: '', component: BioDataBuilderComponent },
  { path: '**', redirectTo: '' },
];
