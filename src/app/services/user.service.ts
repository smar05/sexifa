import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { IQueryParams } from './../interface/i-query-params';
import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { Iuser } from '../interface/iuser';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private urlUsers: string = environment.urlCollections.users;

  constructor(private apiService: ApiService) {}

  /**
   * Se toma la informacion de la coleccion de usuarios en Firebase
   *
   * @param {IQueryParams} [queryParams={}]
   * @return {*}  {Observable<any>}
   * @memberof UsersService
   */
  public getData(queryParams: IQueryParams = {}): Observable<any> {
    return this.apiService.get(`${this.urlUsers}.json`, queryParams);
  }

  /**
   * Tomar un item de usuarios
   *
   * @param {string} id
   * @param {IQueryParams} [queryParams={}]
   * @return {*}  {Observable<any>}
   * @memberof UsersService
   */
  public getItem(id: string, queryParams: IQueryParams = {}): Observable<any> {
    return this.apiService.get(`${this.urlUsers}/${id}.json`, queryParams);
  }

  /**
   * Guardar informacion del usuario
   *
   * @param {Iuser} data
   * @return {*}  {Observable<any>}
   * @memberof UsersService
   */
  public postData(data: Iuser): Observable<any> {
    return this.apiService.post(`${this.urlUsers}.json`, data);
  }

  /**
   * Actualizar usuario
   *
   * @param {string} id
   * @param {object} data
   * @return {*}  {Observable<any>}
   * @memberof UsersService
   */
  public patchData(id: string, data: object): Observable<any> {
    return this.apiService.patch(`${this.urlUsers}/${id}.json`, data);
  }

  /**
   * Eliminar usuario
   *
   * @param {string} id
   * @return {*}  {Observable<any>}
   * @memberof UsersService
   */
  public deleteData(id: string): Observable<any> {
    return this.apiService.delete(`${this.urlUsers}/${id}.json`);
  }
}
