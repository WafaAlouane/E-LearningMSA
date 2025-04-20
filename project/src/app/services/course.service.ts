import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course, CourseSearchParams, StatisticsResponse } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = '/courses';

  constructor(private http: HttpClient) { }

  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/list`);
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`);
  }

  createCourse(course: Course): Observable<Course> {
    return this.http.post<Course>(this.apiUrl, course);
  }

  updateCourse(id: number, course: Course): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/${id}`, course);
  }

  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchCourses(params: CourseSearchParams): Observable<Course[]> {
    let httpParams = new HttpParams();
    
    if (params.title) httpParams = httpParams.set('title', params.title);
    if (params.description) httpParams = httpParams.set('description', params.description);
    if (params.instructor) httpParams = httpParams.set('instructor', params.instructor);
    if (params.duration) httpParams = httpParams.set('duration', params.duration);
    if (params.price) httpParams = httpParams.set('price', params.price);
    
    return this.http.get<Course[]>(`${this.apiUrl}/search`, { params: httpParams });
  }

  getCoursesStatistics(): Observable<StatisticsResponse> {
    return this.http.get<StatisticsResponse>(`${this.apiUrl}/courses-statistics`);
  }

  getCourseraCourses(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/coursera`);
  }
}