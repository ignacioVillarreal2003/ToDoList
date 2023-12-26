import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authorization = `Bearer ${this.authService.getToken()}`;
    const modifiedRequest = request.clone({
      setHeaders: {
        Authorization: authorization
      }
    });
    return next.handle(modifiedRequest);
  }

  
}
