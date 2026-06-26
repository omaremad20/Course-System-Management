import { inject, OnDestroy, Service } from '@angular/core';
import { Subscription } from 'rxjs';
import { DialogService } from '../../../../../core/services/dialog/dialog';
import { SnackbarService } from '../../../../../core/services/snackbar/snackbar';
import { CoursesService } from '../courses';
import { IMinCourse } from '../../../models/IMinCourse';

@Service()
export class DeleteCourseAction implements OnDestroy {
  private readonly _DialogService = inject(DialogService);
  private readonly _SnackbarService = inject(SnackbarService);
  private readonly _CoursesService = inject(CoursesService);

  private cancelConfirmModal!: Subscription;
  private cancelDeleteCourse!: Subscription;

  handleDelete(minCourse: IMinCourse, callBack: () => void) {
    this.cancelConfirmModal = this._DialogService
      .confirm({
        title: 'Delete Course',
        message: `Are you sure you want to delete this course '${minCourse.courseName}' ? This action cannot be undone.`,
        confirmLabel: 'Delete',
        confirmColor: 'warn',
      })
      .subscribe((confirmed) => {
        if (!confirmed) return;

        this.cancelDeleteCourse = this._CoursesService.deleteCourse(minCourse.id).subscribe({
          next: () => {
            callBack();
            this._SnackbarService.success('Course deleted successfully.');
          },
          error: () => {
            this._SnackbarService.error('Failed to delete course.');
          }
        });
      });
  }

  ngOnDestroy(): void {
    this.cancelConfirmModal?.unsubscribe();
    this.cancelDeleteCourse?.unsubscribe();
  }
}
