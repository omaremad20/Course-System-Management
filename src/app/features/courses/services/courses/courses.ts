import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../../enviroments/enviroment';
import { ICourse } from '../../models/ICourse';

@Injectable({ providedIn: 'root' })
export class CoursesService {
  private http = inject(HttpClient);
  private readonly URL = environment.DEV_API_URL_BACKEND;

  fetchCourses(paramsObj: {
    page: number;
    limit: number;
    search?: string;
    status?: string;
    sort?: string;
    order?: 'asc' | 'desc';
  }): Observable<{ data: ICourse[]; totalCount: number }> {
    let params = new HttpParams().set('_page', paramsObj.page).set('_per_page', paramsObj.limit);

    if (paramsObj.search) params = params.set('courseName_like', paramsObj.search);
    if (paramsObj.status) params = params.set('status', paramsObj.status);
    if (paramsObj.sort && paramsObj.order) {
      params = params.set('_sort', `${paramsObj.order === 'desc' ? '-' : ''}${paramsObj.sort}`);
    }

    return this.http.get<any>(`${this.URL}/courses`, { params }).pipe(
      map((res) => ({
        data: res.data ?? [],
        totalCount: res.items ?? 0,
      })),
    );
  }

  fetchSpecificCourseDetails(courseId: string): Observable<ICourse> {
    return this.http.get<ICourse>(`${this.URL}/courses/${courseId}`);
  }

  createNewCourse(course: ICourse): Observable<ICourse> {
    return this.http.post<ICourse>(`${this.URL}/courses`, course);
  }

  updateCourse(course: ICourse, courseId: string): Observable<ICourse> {
    return this.http.put<ICourse>(`${this.URL}/courses/${courseId}`, course);
  }

  deleteCourse(courseId: string): Observable<any> {
    return this.http.delete<any>(`${this.URL}/courses/${courseId}`);
  }
}
