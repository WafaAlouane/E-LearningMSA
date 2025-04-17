import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { AuthenticationEffects } from '@/app/store/authentication/authentication.effects'
import { AuthService } from '../service/auth-service.service'

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(public autheffect: AuthenticationEffects) {}

  intercept(
    request: HttpRequest<Request>,
    next: HttpHandler
  ): Observable<HttpEvent<Event>> {
    const authenticationService = inject(AuthService)

    return next.handle(request).pipe(
      catchError((err) => {
        if (err.status === 401) {
          authenticationService.removeSession()
          window.location.reload()
        }

        const error = err.error.message || err.statusText
        return throwError(error)
      })
    )
  }
}
