import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../../enviroments/enviroment';
import { ICourse } from '../../models/ICourse';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  private http = inject(HttpClient);
  private readonly URL = environment.API_URL;

  fetchCourses(paramsObj: {
    page: number;
    limit: number;
    search?: string;
    status?: string;
    sort?: string;
    order?: 'asc' | 'desc';
  }): Observable<{ data: ICourse[]; totalCount: number }> {
    let params = new HttpParams()
      .set('_page', paramsObj.page.toString())
      .set('_limit', paramsObj.limit.toString());

    if (paramsObj.search) params = params.set('q', paramsObj.search);
    if (paramsObj.status) params = params.set('status', paramsObj.status);
    if (paramsObj.sort) params = params.set('_sort', paramsObj.sort);
    if (paramsObj.order) params = params.set('_order', paramsObj.order);

    return this.http.get<ICourse[]>(`${this.URL}/courses`, { params, observe: 'response' }).pipe(
      map((response) => ({
        data: response.body || [],
        totalCount: Number(response.headers.get('X-Total-Count')) || 0,
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
