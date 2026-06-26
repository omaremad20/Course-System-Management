import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorState } from '../../../../shared/components/error-state/error-state';
import { CourseDetailsSkeleton } from '../../components/course-details-skeleton/course-details-skeleton';
import { ICourse } from '../../models/ICourse';
import { CoursesService } from '../../services/courses/courses';
import { DeleteCourseAction } from '../../services/courses/deleteCourseAction/delete-course-action';
import { IMinCourse } from '../../models/IMinCourse';
@Component({
  selector: 'app-coursedetails',
  imports: [
    MatIconModule,
    RouterLink,
    CommonModule,
    MatButtonModule,
    CourseDetailsSkeleton,
    ErrorState,
  ],
  templateUrl: './course-details.html',
  styleUrl: './course-details.css',
})
export class Coursedetails implements OnInit, OnDestroy {
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _ChangeDetectorRef = inject(ChangeDetectorRef);
  private readonly _CoursesService = inject(CoursesService);
  private readonly _Router = inject(Router);

  fetchCourseDetailsStatus: 'loading' | 'error' | 'success' | 'not-found' | null = null;
  cancelFetchCourseDetails!: Subscription;
  courseId: string | null = null;
  course: ICourse | null = null;

  fetchCourseDetails() {
    this.cancelFetchCourseDetails = this._CoursesService
      .fetchSpecificCourseDetails(this.courseId!)
      .subscribe({
        next: (response: ICourse) => {
          this.course = response;
          this.fetchCourseDetailsStatus = 'success';
          this._ChangeDetectorRef.detectChanges();
        },
        error: (error) => {
          this.fetchCourseDetailsStatus = error.status === 404 ? 'not-found' : 'error';
          this._ChangeDetectorRef.detectChanges();
        },
      });
  }

  ngOnInit(): void {
    this.courseId = this._ActivatedRoute.snapshot.paramMap.get('courseId');

    if (!this.courseId) {
      this.fetchCourseDetailsStatus = 'not-found';
    } else {
      this.fetchCourseDetails();
    }
  }

  readonly _DeleteCourseAction = inject(DeleteCourseAction);
  onDeleteCourse(course: IMinCourse) {
    this._DeleteCourseAction.handleDelete(course, () => {
      this._Router.navigate(['/list']);
    });
  }

  ngOnDestroy(): void {
    this.cancelFetchCourseDetails?.unsubscribe();
  }
}
