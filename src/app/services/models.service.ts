import { Imodels } from './../interface/imodels';
import { Observable } from 'rxjs';
import { IQueryParams } from './../interface/i-query-params';
import { ApiService } from './api.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModelsService {
  private urlModels: string = 'models';

  constructor(private apiService: ApiService) {}

  /**
   * Se toma la informacion de la coleccion de modelos en Firebase
   *
   * @param {IQueryParams} [queryParams={}]
   * @return {*}  {Observable<any>}
   * @memberof ModelsService
   */
  public getData(queryParams: IQueryParams = {}): Observable<any> {
    return this.apiService.get(`${this.urlModels}.json`, queryParams);
  }

  /**
   * Tomar un item de modelos
   *
   * @param {string} id
   * @param {IQueryParams} [queryParams={}]
   * @return {*}  {Observable<any>}
   * @memberof ModelsService
   */
  public getItem(id: string, queryParams: IQueryParams = {}): Observable<any> {
    return this.apiService.get(`${this.urlModels}/${id}.json`, queryParams);
  }

  /**
   * Guardar informacion del modelo
   *
   * @param {Imodels} data
   * @return {*}  {Observable<any>}
   * @memberof ModelsService
   */
  public postData(data: Imodels): Observable<any> {
    return this.apiService.post(`${this.urlModels}.json`, data);
  }

  /**
   * Actualizar modelo
   *
   * @param {string} id
   * @param {object} data
   * @return {*}  {Observable<any>}
   * @memberof ModelsService
   */
  public patchData(id: string, data: object): Observable<any> {
    return this.apiService.patch(`${this.urlModels}/${id}.json`, data);
  }

  /**
   * Eliminar modelo
   *
   * @param {string} id
   * @return {*}  {Observable<any>}
   * @memberof ModelsService
   */
  public deleteData(id: string): Observable<any> {
    return this.apiService.delete(`${this.urlModels}/${id}.json`);
  }
}
