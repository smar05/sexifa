import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private urlApi: string = environment.urlFirebase;

  constructor(private http: HttpClient) {}

  /**
   * Metodo GET
   *
   * @param {string} endPoint endPoint y QueryParams
   * @return {*}  {Observable<any>}
   * @memberof ApiService
   */
  public get(endPoint: string, params: any = {}): Observable<any> {
    return this.http.get(`${this.urlApi}${endPoint}`, { params });
  }

  /**
   * Metodo POST
   *
   * @param {string} endPoint endPoint y QueryParams
   * @param {object} data Datos a guardar
   * @return {*}  {Observable<any>}
   * @memberof ApiService
   */
  public post(endPoint: string, data: object): Observable<any> {
    return this.http.post(`${this.urlApi}${endPoint}`, data);
  }

  /**
   * Metodo DELETE
   *
   * @param {string} endPoint endPoint y QueryParams
   * @return {*}  {Observable<any>}
   * @memberof ApiService
   */
  public delete(endPoint: string): Observable<any> {
    return this.http.delete(`${this.urlApi}${endPoint}&print=pretty`);
  }

  /**
   * Metodo PATCH
   *
   * @param {string} endPoint
   * @param {object} data
   * @return {*}  {Observable<any>}
   * @memberof ApiService
   */
  public patch(endPoint: string, data: object): Observable<any> {
    return this.http.patch(`${this.urlApi}${endPoint}`, data);
  }
}
