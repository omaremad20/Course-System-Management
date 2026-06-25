import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: 'course-details/:courseId', renderMode: RenderMode.Server },
  { path: 'edit-course/:courseId', renderMode: RenderMode.Server },

  { path: '**', renderMode: RenderMode.Prerender },
];
