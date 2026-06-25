import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { CoursesService } from '../../services/courses/courses';
import { ICourse } from '../../models/ICourse';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { CourseDetailsSkeleton } from "../../components/course-details-skeleton/course-details-skeleton";
import { ErrorState } from "../../../../shared/components/error-state/error-state";
@Component({
  selector: 'app-coursedetails',
  imports: [MatIconModule, RouterLink, CommonModule, MatButtonModule, CourseDetailsSkeleton, ErrorState],
  templateUrl: './course-details.html',
  styleUrl: './course-details.css',
})
export class Coursedetails implements OnInit, OnDestroy {
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _ChangeDetectorRef = inject(ChangeDetectorRef);
  private readonly _CoursesService = inject(CoursesService);

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
          console.log(error);
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

  ngOnDestroy(): void {
    this.cancelFetchCourseDetails?.unsubscribe();
  }
}
