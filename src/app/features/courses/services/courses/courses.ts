  import { HttpClient } from '@angular/common/http';
  import { inject, Service } from '@angular/core';
  import { Observable } from 'rxjs';
  import { environment } from '../../../../enviroments/enviroment';
  import { ICourse } from '../../models/ICourse';

  @Service()
  export class CoursesService {
    private http = inject(HttpClient);
    private readonly URL = environment.API_URL;

    // GET ALL COURSES
    fetchCourses(): Observable<ICourse[]> {
      return this.http.get<ICourse[]>(`${this.URL}/courses`);
    }

    // GET SPECIFIC COURSE DETAILS
    fetchSpecificCourseDetails(courseId: string): Observable<ICourse> {
      return this.http.get<ICourse>(`${this.URL}/courses/${courseId}`);
    }

    // CREATE NEW COURSE
    createNewCourse(course: ICourse): Observable<ICourse> {
      return this.http.post<ICourse>(`${this.URL}/courses`, course);
    }

    // UPDATE COURSE (the sent course object will replaced with old course object)
    updateCourse(course: ICourse, courseId: string): Observable<ICourse> {
      return this.http.put<ICourse>(`${this.URL}/courses/${courseId}`, course);
    }

    // DELETE COURSE
    deleteCourse(courseId: string) {
      return this.http.delete<ICourse>(`${this.URL}/courses/${courseId}`);
    }
  }
