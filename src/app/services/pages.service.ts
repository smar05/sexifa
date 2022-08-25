import { Ipages } from './../interface/ipages';
import { Observable } from 'rxjs';
import { IQueryParams } from './../interface/i-query-params';
import { ApiService } from './api.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PagesService {
  private urlPages: string = 'pages';

  constructor(private apiService: ApiService) {}

  /**
   * Se toma la informacion de la coleccion de paginas en Firebase
   *
   * @param {IQueryParams} [queryParams={}]
   * @return {*}  {Observable<any>}
   * @memberof PagesService
   */
  public getData(queryParams: IQueryParams = {}): Observable<any> {
    return this.apiService.get(`${this.urlPages}.json`, queryParams);
  }

  /**
   * Tomar un item de paginas
   *
   * @param {string} id
   * @param {IQueryParams} [queryParams={}]
   * @return {*}  {Observable<any>}
   * @memberof PagesService
   */
  public getItem(id: string, queryParams: IQueryParams = {}): Observable<any> {
    return this.apiService.get(`${this.urlPages}/${id}.json`, queryParams);
  }

  /**
   * Guardar informacion de la categoria
   *
   * @param {IPages} data
   * @return {*}  {Observable<any>}
   * @memberof CategoriesService
   */
  public postData(data: Ipages): Observable<any> {
    return this.apiService.post(`${this.urlPages}.json`, data);
  }

  /**
   * Actualizar categoria
   *
   * @param {string} id
   * @param {object} data
   * @return {*}  {Observable<any>}
   * @memberof PagesService
   */
  public patchData(id: string, data: Ipages): Observable<any> {
    return this.apiService.patch(`${this.urlPages}/${id}.json`, data);
  }
}
