import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent) },
  { path: 'courses', loadComponent: () => import('./components/courses/course-list/course-list.component').then(m => m.CourseListComponent) },
  { path: 'courses/new', loadComponent: () => import('./components/courses/course-form/course-form.component').then(m => m.CourseFormComponent) },
  { path: 'courses/:id', loadComponent: () => import('./components/courses/course-detail/course-detail.component').then(m => m.CourseDetailComponent) },
  { path: 'courses/:id/edit', loadComponent: () => import('./components/courses/course-form/course-form.component').then(m => m.CourseFormComponent) },
  { path: 'statistics', loadComponent: () => import('./components/statistics/statistics.component').then(m => m.StatisticsComponent) },
  { path: 'universities', loadComponent: () => import('./components/universities/universities.component').then(m => m.UniversitiesComponent) },
  { path: 'external', loadComponent: () => import('./components/external/external.component').then(m => m.ExternalComponent) },
  { path: '**', loadComponent: () => import('./components/not-found/not-found.component').then(m => m.NotFoundComponent) }
];