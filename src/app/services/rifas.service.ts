import { Irifas } from './../interface/irifas';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment.prod';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { IQueryParams } from '../interface/i-query-params';

@Injectable({
  providedIn: 'root',
})
export class RifasService {
  private urlRifas: string = environment.urlCollections.rifas;

  constructor(private apiService: ApiService) {}

  /**
   * Se toma la informacion de la coleccion de rifas en Firebase
   *
   * @param {IQueryParams} [queryParams={}]
   * @return {*}  {Observable<any>}
   * @memberof RifasService
   */
  public getData(queryParams: IQueryParams = {}): Observable<any> {
    return this.apiService.get(`${this.urlRifas}.json`, queryParams);
  }

  /**
   * Tomar un item de rifas
   *
   * @param {string} id
   * @param {IQueryParams} [queryParams={}]
   * @return {*}  {Observable<any>}
   * @memberof RifasService
   */
  public getItem(id: string, queryParams: IQueryParams = {}): Observable<any> {
    return this.apiService.get(`${this.urlRifas}/${id}.json`, queryParams);
  }

  /**
   * Guardar informacion de la rifa
   *
   * @param {Irifas} data
   * @return {*}  {Observable<any>}
   * @memberof CategoriesService
   */
  public postData(data: Irifas): Observable<any> {
    return this.apiService.post(`${this.urlRifas}.json`, data);
  }

  /**
   * Actualizar rifa
   *
   * @param {string} id
   * @param {object} data
   * @return {*}  {Observable<any>}
   * @memberof RifasService
   */
  public patchData(id: string, data: Irifas): Observable<any> {
    return this.apiService.patch(`${this.urlRifas}/${id}.json`, data);
  }
}
