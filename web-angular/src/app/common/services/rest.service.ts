import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface RequestOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> };
  skipErrorHandling?: boolean;
}

interface HttpOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> };
}

@Injectable({
  providedIn: 'root',
})
export class RestService {
  private http = inject(HttpClient);

  get<T>(url: string, options?: RequestOptions): Observable<T> {
    return this.http.get<T>(url, this.buildHttpOptions(options));
  }

  post<T>(url: string, body: any, options?: RequestOptions): Observable<T> {
    return this.http.post<T>(url, body, this.buildHttpOptions(options));
  }

  put<T>(url: string, body: any, options?: RequestOptions): Observable<T> {
    return this.http.put<T>(url, body, this.buildHttpOptions(options));
  }

  patch<T>(url: string, body: any, options?: RequestOptions): Observable<T> {
    return this.http.patch<T>(url, body, this.buildHttpOptions(options));
  }

  delete<T>(url: string, options?: RequestOptions): Observable<T> {
    return this.http.delete<T>(url, this.buildHttpOptions(options));
  }

  private buildHttpOptions(options?: RequestOptions): HttpOptions {
    const httpOptions: HttpOptions = {};

    if (options?.headers) {
      httpOptions.headers = options.headers;
    }

    if (options?.params) {
      httpOptions.params = options.params;
    }

    // Add skip error handling header if specified
    if (options?.skipErrorHandling) {
      if (!httpOptions.headers) {
        httpOptions.headers = new HttpHeaders();
      }

      if (httpOptions.headers instanceof HttpHeaders) {
        httpOptions.headers = httpOptions.headers.set('Skip-Error-Handling', 'true');
      } else {
        httpOptions.headers = {
          ...httpOptions.headers,
          'Skip-Error-Handling': 'true',
        };
      }
    }

    return httpOptions;
  }
}
