import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { DialogService } from './../../../../core/services/dialog/dialog';
import { CourseForm } from './../../pages/course-form/course-form';

export const formExitGuard: CanDeactivateFn<CourseForm> = (component) => {
  if (!component.courseForm.dirty || component.formStatus === 'success') {
    return true;
  }

  const dialog = inject(DialogService);

  if (!component.isEditMode) {
    return dialog.confirm({
      title:        'Discard New Course?',
      message:      'You have unsaved changes. Are you sure you want to leave? All data will be lost.',
      confirmLabel: 'Discard',
      confirmColor: 'warn',
    });
  }

  return dialog.confirm({
    title:        'Unsaved Changes',
    message:      'You have unsaved changes. Do you want to leave without saving?',
    confirmLabel: 'Discard',
    confirmColor: 'warn',
  });
};