import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { map } from 'rxjs'
import { CookieService } from 'ngx-cookie-service'
import type { User } from '../helpers/user'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: User | null = null

  public readonly authSessionKey = 'EDUPORT_AUTH_SESSION_KEY_'

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) {}

  login(email: string, password: string) {
    return this.http.post<User>(`api/login`, { email, password }).pipe(
      map((user) => {
        if (user && user.token) {
          this.cookieService.set(
            this.authSessionKey,
            JSON.stringify(user.token),
            1,
            '/'
          )
        }
        return user
      })
    )
  }

  signup(name: string, email: string, password: string) {
    return this.http
      .post<User>(`/api/signup`, { name, email, password })
      .pipe(map((user) => user))
  }

  logout(): void {
    this.cookieService.delete(this.authSessionKey)
    this.user = null
  }

  get session(): string {
    return this.cookieService.get(this.authSessionKey)
  }

  saveSession(token: string): void {
    this.cookieService.set(this.authSessionKey, token)
  }

  removeSession(): void {
    this.cookieService.delete(this.authSessionKey)
  }
}
