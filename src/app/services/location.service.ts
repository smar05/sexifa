import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private urlLocation: string = environment.urlLocation;
  private apiKeyLocation: string = environment.apiKeyLocation;

  private headers: HttpHeaders = new HttpHeaders().set(
    'Access-Control-Allow-Origin',
    'http://battuta.medunes.net'
  );

  constructor(private http: HttpClient) {}

  /**
   * Consulta de todos los paises
   *
   * @return {*}  {Observable<any>}
   * @memberof LocationService
   */
  public getAllContries(): Observable<any> {
    return this.http.get(`${this.urlLocation}country/all`, {
      params: { key: this.apiKeyLocation },
      headers: this.headers,
    });
  }
}
