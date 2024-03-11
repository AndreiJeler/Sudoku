import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, Subject } from 'rxjs';
import { environment } from 'apps/sudoku/src/environments/environment';
import { DialogService } from '@sudoku/shared';

@Injectable()
export class ApiService {
  public baseUrl: string;
  public errors = new Subject<HttpErrorResponse>();

  constructor(private http: HttpClient, private dialogService: DialogService) {
    this.baseUrl = environment.sudokuAPIUrl;
  }

  get<T>(
    path: string,
    params: any = {},
    areErrorsHandledInComponent?: boolean
  ): Observable<T> {
    const httpParams = this._parseQueryParams(params);
    return this.http
      .get<T>(`${this.baseUrl}${path}`, { params: httpParams })
      .pipe(
        catchError((err) =>
          this._handleHttpError(err, areErrorsHandledInComponent)
        )
      );
  }

  put<T>(
    path: string,
    body: object = {},
    options?: object,
    areErrorsHandledInComponent?: boolean
  ): Observable<T> {
    return this.http
      .put<T>(`${this.baseUrl}${path}`, body, options)
      .pipe(
        catchError((err) =>
          this._handleHttpError(err, areErrorsHandledInComponent)
        )
      );
  }

  post<T>(
    path: string,
    body: object = {},
    options?: object,
    areErrorsHandledInComponent?: boolean
  ): Observable<T> {
    return this.http
      .post<T>(`${this.baseUrl}${path}`, body, options)
      .pipe(
        catchError((err) =>
          this._handleHttpError(err, areErrorsHandledInComponent)
        )
      );
  }

  delete<T>(
    path: string,
    areErrorsHandledInComponent?: boolean
  ): Observable<any> {
    return this.http
      .delete<T>(`${this.baseUrl}${path}`)
      .pipe(
        catchError((err) =>
          this._handleHttpError(err, areErrorsHandledInComponent)
        )
      );
  }

  private _handleHttpError(
    err: HttpErrorResponse,
    areErrorsHandledInComponent?: boolean
  ): never {
    if (areErrorsHandledInComponent == true) throw err;

    this.dialogService.showDialog({
      title: 'Error',
      icon: 'error',
      text: err.error ?? 'An error has occurred',
    });
    throw err;
  }

  private _parseQueryParams(params: any): HttpParams {
    let httpParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      const value = params[key];
      if (value !== null && value !== undefined && value !== '') {
        if (value instanceof Array) {
          value.forEach(
            (arrayItem) => (httpParams = httpParams.append(key, arrayItem))
          );
        } else {
          httpParams = httpParams.append(key, value);
        }
      }
    });
    return httpParams;
  }
}
