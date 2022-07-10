import { IQueryParams } from './../interface/i-query-params';
import { functions } from 'src/app/helpers/functions';
import { ApiService } from './api.service';
import { Icategories } from './../interface/icategories';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private urlCategories: string = 'categories';

  constructor(private apiService: ApiService) {}

  /**
   * Se toma la informacion de la coleccion de Categorias en Firebase
   *
   * @param {IQueryParams} [queryParams={}]
   * @return {*}  {Observable<any>}
   * @memberof CategoriesService
   */
  public getData(queryParams: IQueryParams = {}): Observable<any> {
    return this.apiService.get(`${this.urlCategories}.json`, queryParams);
  }

  /**
   * Tomar un item de categorias
   *
   * @param {string} id
   * @param {IQueryParams} [queryParams={}]
   * @return {*}  {Observable<any>}
   * @memberof CategoriesService
   */
  public getItem(id: string, queryParams: IQueryParams = {}): Observable<any> {
    return this.apiService.get(
      `${this.urlCategories}/${id}.json?${functions.jsonToQueryParams(
        queryParams
      )}`
    );
  }

  /**
   * Guardar informacion de la categoria
   *
   * @param {Icategories} data
   * @return {*}  {Observable<any>}
   * @memberof CategoriesService
   */
  public postData(data: Icategories): Observable<any> {
    return this.apiService.post(`${this.urlCategories}.json`, data);
  }

  /**
   * Actualizar categoria
   *
   * @param {string} id
   * @param {object} data
   * @return {*}  {Observable<any>}
   * @memberof CategoriesService
   */
  public patchData(id: string, data: object): Observable<any> {
    return this.apiService.patch(`${this.urlCategories}/${id}.json`, data);
  }

  /**
   * Eliminar categoria
   *
   * @param {string} id
   * @return {*}  {Observable<any>}
   * @memberof CategoriesService
   */
  public deleteData(id: string): Observable<any> {
    return this.apiService.delete(`${this.urlCategories}/${id}.json`);
  }
}
