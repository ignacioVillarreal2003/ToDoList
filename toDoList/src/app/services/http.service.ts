import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ITarea } from '../ITarea';
import { IUsuario } from '../IUsuario';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido';
    if (error.error instanceof ErrorEvent || error.status) {
      errorMessage = error.error.message;
    } 
    return throwError(errorMessage);
  }

  registrarUsuario(username: string, password: string): Observable<any> {
    const listaTareas: ITarea[] = []
    const requestBody: IUsuario = { username: username, password: password, listaTareas: listaTareas };
    return this.http.post<any>('http://localhost:3000/registrarUsuario', requestBody, this.httpOptions).pipe(
      catchError(this.handleError),
      map(response => {
        if (response && response.token) {
          return response.token;
        }
        return null;
      })
    );
  }

  loguearUsuario(username: string, password: string): Observable<any> {
    const listaTareas: ITarea[] = []
    const requestBody: IUsuario = { username: username, password: password, listaTareas: listaTareas };
    return this.http.post<any>('http://localhost:3000/loguearUsuario', requestBody, this.httpOptions).pipe(
      catchError(this.handleError),
      map(response => {
        if (response && response.token) {
          return response.token;
        }
        return null;
      })
    );
  }

  obtenerTareas(username: string): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/obtenerTareas/${username}`, this.httpOptions).pipe(
      catchError(this.handleError),
      map((response: any) => {
        if (response && response.tareas) {
          return response.tareas;
        }
        return null;
      })
    );
  }

  actualizarTareas(username: string, listaTareas: ITarea[]): Observable<any> {
    const requestBody = { username: username, tareas: listaTareas };
    return this.http.post<any>('http://localhost:3000/actualizarTarea', requestBody, this.httpOptions).pipe(
      catchError(this.handleError),
    );
  }
}
