import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Joke, Quote, Activity } from '../models/external-apis.model';
import { University } from '../models/university.model';

@Injectable({
  providedIn: 'root'
})
export class ExternalApiService {
  private apiUrl = '/courses';

  constructor(private http: HttpClient) { }

  getRandomJoke(): Observable<Joke> {
    return this.http.get<Joke>(`${this.apiUrl}/joke`);
  }

  getStudyQuote(): Observable<Quote[]> {
    return this.http.get<Quote[]>(`${this.apiUrl}/quote`);
  }

  getRandomActivity(): Observable<Activity> {
    return this.http.get<Activity>(`${this.apiUrl}/activity`);
  }

  searchUniversities(name: string): Observable<University[]> {
    return this.http.get<University[]>(`${this.apiUrl}/universities`, {
      params: new HttpParams().set('name', name)
    });
  }
}