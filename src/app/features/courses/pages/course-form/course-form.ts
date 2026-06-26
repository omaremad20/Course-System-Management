import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { SnackbarService } from '../../../../core/services/snackbar/snackbar';
import { FormField } from '../../../../shared/components/form-field/form-field';
import { FormSkeletonComponent } from '../../../../shared/components/form-skeleton/form-skeleton';
import { ICourse } from '../../models/ICourse';
import { CoursesService } from '../../services/courses/courses';
import { DialogService } from '../../../../core/services/dialog/dialog';

class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-course-form',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    RouterLink,
    FormField,
    FormSkeletonComponent,
  ],
  templateUrl: './course-form.html',
  styleUrl: './course-form.css',
})
export class CourseForm implements OnInit, OnDestroy {
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _Router = inject(Router);
  private readonly _CoursesService = inject(CoursesService);
  private readonly _ChangeDetectorRef = inject(ChangeDetectorRef);
  private readonly _SnackbarService = inject(SnackbarService);
  private readonly _DialogService = inject(DialogService);

  @ViewChild('formRef') formRef!: FormGroupDirective;

  matcher = new MyErrorStateMatcher();

  formStatus: 'loading' | 'error' | 'success' | null = null;
  fetchStatus: 'loading' | 'error' | 'not-found' | 'success' | 'idle' = 'idle';

  isEditMode = false;
  courseId: string | null = null;

  originalValues: Partial<ICourse> = {};

  statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'draft', label: 'Draft' },
    { value: 'archived', label: 'Archived' },
  ];

  cancelLoadCourse!: Subscription;
  cancelHandleCreate!: Subscription;
  cancelHandleUpdate!: Subscription;

  courseForm = new FormGroup({
    id: new FormControl(''),
    courseName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    instructorName: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    duration: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    price: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    status: new FormControl<ICourse['status'] | null>(null, [Validators.required]),
    description: new FormControl('', [Validators.maxLength(500)]),
    createdDate: new FormControl(''),
  });

  get f() {
    return this.courseForm.controls;
  }

  ngOnInit() {
    this.courseId = this._ActivatedRoute.snapshot.paramMap.get('courseId');
    if (this.courseId) {
      this.isEditMode = true;
      console.log(this.fetchStatus);
      this.loadCourse();
    }
  }

  loadCourse() {
    this.fetchStatus = 'loading';
    this.cancelLoadCourse = this._CoursesService
      .fetchSpecificCourseDetails(this.courseId!)
      .subscribe({
        next: (course) => {
          this.courseForm.patchValue(course as any);
          this.originalValues = { ...course };
          this.fetchStatus = 'success';
          this._ChangeDetectorRef.detectChanges();
        },
        error: (err) => {
          this.fetchStatus = err.status === 404 ? 'not-found' : 'error';
          console.log(this.fetchStatus);
          this._ChangeDetectorRef.detectChanges();
        },
      });
  }

  handleForm(formRef: any) {
    if (this.isEditMode) {
      this.handleUpdate();
    } else {
      this.handleCreate(formRef);
    }
  }

  handleCreate(formRef: NgForm) {
    this.formStatus = 'loading';

    this.f['id'].setValue(crypto.randomUUID());
    this.f['createdDate'].setValue(new Date().toISOString().split('T')[0]);

    if (this.courseForm.invalid) {
      this.courseForm.markAllAsTouched();
      this.formStatus = 'error';
      this._SnackbarService.error('Please fill in all required fields.');
      return;
    }

    const payload = this.trimmedValues();

    this.cancelHandleCreate = this._CoursesService.createNewCourse(payload).subscribe({
      next: (res) => {
        this.formStatus = 'success';
        this._SnackbarService.success('Course deleted successfully.');
        formRef.resetForm();
      },
      error: () => {
        this.formStatus = 'error';
        this._SnackbarService.error('Failed to create course. Please try again.');
      },
    });
  }

  handleUpdate() {
    this.formStatus = 'loading';

    if (this.courseForm.invalid) {
      this.courseForm.markAllAsTouched();
      this.formStatus = 'error';
      this._SnackbarService.error('Please fill in all required fields.');
      return;
    }

    if (!this.courseForm.dirty) {
      this.formStatus = null;
      this._SnackbarService.error('No changes to save.');
      return;
    }

    this._DialogService
      .confirm({
        title: 'Save Changes?',
        message: 'Are you sure you want to update this course?',
        confirmLabel: 'Save',
        confirmColor: 'primary',
      })
      .subscribe((confirmed) => {
        if (!confirmed) {
          this.formStatus = null;
          return;
        }

        const payload = this.trimmedValues();

        this.cancelHandleUpdate = this._CoursesService
          .updateCourse(payload, this.courseId!)
          .subscribe({
            next: () => {
              this.formStatus = 'success';
              this.originalValues = { ...payload };
              this.courseForm.markAsPristine();
              this._SnackbarService.success('Course updated successfully!');
              this._Router.navigate(['/course-details', this.courseId]);
            },
            error: () => {
              this.formStatus = 'error';
              this._SnackbarService.error('Failed to update course. Please try again.');
            },
          });
      });
  }

  handleReset(formRef: any) {
    if (this.isEditMode) {
      this.courseForm.patchValue(this.originalValues as any);
      this.courseForm.markAsPristine();
    } else {
      formRef.resetForm();
    }
  }

  private trimmedValues(): ICourse {
    const raw = this.courseForm.value;
    const trimmed: any = {};
    for (const key in raw) {
      const val = (raw as any)[key];
      trimmed[key] = typeof val === 'string' ? val.trim() : val;
    }
    return trimmed as ICourse;
  }

  ngOnDestroy(): void {
    this.cancelHandleCreate?.unsubscribe();
    this.cancelHandleUpdate?.unsubscribe();
    this.cancelLoadCourse?.unsubscribe();
  }
}
