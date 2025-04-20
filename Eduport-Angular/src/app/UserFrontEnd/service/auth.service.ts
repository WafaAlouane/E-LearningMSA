import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private temporaryEmail: string | null = null;
  private apiUrl = 'http://localhost:8081/api/auth';

  constructor(private http: HttpClient) {}

  // Méthodes existantes
  setTemporaryEmail(email: string) {
    this.temporaryEmail = email;
  }

  getTemporaryEmail(): string | null {
    return this.temporaryEmail;
  }

  login(request: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signin`, request);
  }

  signUp(request: any): Observable<any> {
    console.log('signupRequest', request);
    return this.http.post(`${this.apiUrl}/signup`, request);
  }

  forgotPassword(email: string): Observable<any> {
    const request = { email }; 
    return this.http.post(`${this.apiUrl}/forgot-password`, request);
  }

  verifyCode(request: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-code`, request);
  }

  resetPassword(email: string, newPassword: string, confirmPassword: string) {
    const resetPasswordRequest = { email, newPassword, confirmPassword };
    return this.http.post(`${this.apiUrl}/reset-password`, resetPasswordRequest);
  }

  // Nouvelles méthodes ajoutées
  isAuthenticated(): boolean {
    return !!localStorage.getItem('user');
  }

  getCurrentUser(): any {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  getUserId(): number | null {
    const user = this.getCurrentUser();
    return user ? user.id : null;
  }
}