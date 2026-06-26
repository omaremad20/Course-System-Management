import { Routes } from '@angular/router';
import { CourseList } from './features/courses/pages/course-list/course-list';
import { formExitGuard } from './features/courses/guards/form-exit/form-exit-guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
    title: 'CMS List',
  },
  {
    title: 'CMS List',
    path: 'list',
    component: CourseList,
  },
  {
    title: 'Course Details - CMS',
    path: 'course-details/:courseId',
    loadComponent: () =>
      import('./features/courses/pages/course-details/course-details').then((c) => c.Coursedetails),
  },
  {
    title: 'Edit Course - CMS',
    path: 'edit-course/:courseId',
    loadComponent: () =>
      import('./features/courses/pages/course-form/course-form').then((c) => c.CourseForm),
    canDeactivate: [formExitGuard],
  },
  {
    title: 'Add Course - CMS',
    path: 'add-course',
    loadComponent: () =>
      import('./features/courses/pages/course-form/course-form').then((c) => c.CourseForm),
    canDeactivate: [formExitGuard],
  },
  {
    title: '404 Page Not Found - CMS',
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then((c) => c.NotFound),
  },
];
