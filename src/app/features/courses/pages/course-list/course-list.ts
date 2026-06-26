import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { ErrorState } from '../../../../shared/components/error-state/error-state';
import { GenericTable } from '../../../../shared/components/generic-table/generic-table';
import { TableSkeleton } from '../../../../shared/components/table-skeleton/table-skeleton';
import { EmptyCoursesState } from '../../components/empty-courses-state/empty-courses-state';
import { ICourse } from '../../models/ICourse';
import { CoursesService } from '../../services/courses/courses';
import { DeleteCourseAction } from '../../services/courses/deleteCourseAction/delete-course-action';
import { IMinCourse } from '../../models/IMinCourse';

type IFetchCoursesStatus = 'loading' | 'error' | 'success-courses' | 'success-!courses' | null;

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    ErrorState,
    TableSkeleton,
    EmptyCoursesState,
    GenericTable,
  ],
  templateUrl: './course-list.html',
  styleUrl: './course-list.css',
})
export class CourseList implements OnInit, OnDestroy {
  private readonly _CoursesService = inject(CoursesService);
  private readonly _Router = inject(Router);
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  readonly _DeleteCourseAction = inject(DeleteCourseAction);

  private cancelFetchCourses!: Subscription;
  private cancelDeleteCourse!: Subscription;
  private cancelConfirmModal!: Subscription;
  private cancelFilterFormValueChanges!: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  filtersForm = new FormGroup(
    {
      search: new FormControl(''),
      status: new FormControl(''),
      sort: new FormControl('newest'),
    },
    { updateOn: 'change' },
  );

  courses = signal<ICourse[]>([]);
  fetchCoursesStatus = signal<IFetchCoursesStatus>(null);

  displayedColumns = [
    'courseName',
    'instructorName',
    'category',
    'duration',
    'price',
    'status',
    'actions',
  ];

  totalCourses = 0;
  pageSize = 5;
  currentPage = 1;

  ngOnInit() {
    const qp = this._ActivatedRoute.snapshot.queryParams;
    this.filtersForm.patchValue(
      {
        search: qp['search'] || '',
        status: qp['status'] || '',
        sort: qp['sort'] || 'newest',
      },
      { emitEvent: false },
    );

    this.currentPage = Number(qp['page']) || 1;
    this.pageSize = Number(qp['limit']) || 5;

    this.getCourses();

    const initialFormValue = JSON.stringify(this.filtersForm.value);

    this.cancelFilterFormValueChanges = this.filtersForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
      )
      .subscribe((currentValue) => {
        if (JSON.stringify(currentValue) === initialFormValue) {
          return;
        }

        this.currentPage = 1;
        this.getCourses();
      });
  }

  getCourses() {
    console.log('calling')
    this.courses.set([]);
    this.fetchCoursesStatus.set('loading');

    this.cancelFetchCourses?.unsubscribe();

    const { search, status, sort } = this.filtersForm.value;

    const sortMap: Record<string, { field: string; order: 'asc' | 'desc' }> = {
      newest: { field: 'createdDate', order: 'desc' },
      oldest: { field: 'createdDate', order: 'asc' },
      'price-low': { field: 'price', order: 'asc' },
      'price-high': { field: 'price', order: 'desc' },
      'duration-low': { field: 'duration', order: 'asc' },
      'duration-high': { field: 'duration', order: 'desc' },
    };
    const { field, order } = sortMap[sort ?? 'newest'] ?? sortMap['newest'];

    this._Router.navigate([], {
      relativeTo: this._ActivatedRoute,
      queryParams: {
        search: search || null,
        status: status || null,
        sort: sort || null,
        page: this.currentPage,
        limit: this.pageSize,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });

    this.cancelFetchCourses = this._CoursesService
      .fetchCourses({
        page: this.currentPage,
        limit: this.pageSize,
        search: search || undefined,
        status: status || undefined,
        sort: field,
        order: order,
      })
      .subscribe({
        next: (res) => {
          this.courses.set(res.data);
          this.totalCourses = res.totalCount;
          this.fetchCoursesStatus.set(
            this.courses().length ? 'success-courses' : 'success-!courses',
          );
        },
        error: () => {
          this.fetchCoursesStatus.set('error');
        },
      });
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getCourses();
  }

  handleView(id: string) {
    this._Router.navigate(['/course-details', id]);
  }

  handleEdit(id: string) {
    this._Router.navigate(['/edit-course', id]);
  }

  onDeleteCourse(course: IMinCourse) {
    this._DeleteCourseAction.handleDelete(course, () => {
      this.getCourses();
    });
  }
  ngOnDestroy() {
    this.cancelFetchCourses?.unsubscribe();
    this.cancelDeleteCourse?.unsubscribe();
    this.cancelConfirmModal?.unsubscribe();
    this.cancelFilterFormValueChanges?.unsubscribe();
  }
}
