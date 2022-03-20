import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/service/auth/auth.service';

@Injectable()
export class AuthentificationInterceptor implements HttpInterceptor {

  constructor(private authentificationService: AuthService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const tokken = this.authentificationService.getAccessToken();
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${tokken}`
      }
    });
    return next.handle(request);
  }
}




