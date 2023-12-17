import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { IQueryParams } from './../interface/i-query-params';
import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { Iuser } from '../interface/iuser';
import { FireStorageService } from './fire-storage.service';
import { QueryFn } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private urlUsers: string = environment.urlCollections.users;

  constructor(
    private apiService: ApiService,
    private fireStorageService: FireStorageService
  ) {}

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

  //------------ FireStorage---------------//
  /**
   *
   *
   * @param {QueryFn} [qf=null]
   * @return {*}  {Observable<any>}
   * @memberof UserService
   */
  public getDataFS(qf: QueryFn = null): Observable<any> {
    return this.fireStorageService
      .getData(this.urlUsers, qf)
      .pipe(this.fireStorageService.mapForPipe('many'));
  }

  /**
   *
   *
   * @param {string} doc
   * @param {QueryFn} [qf=null]
   * @return {*}  {Observable<any>}
   * @memberof UserService
   */
  public getItemFS(doc: string, qf: QueryFn = null): Observable<any> {
    return this.fireStorageService
      .getItem(this.urlUsers, doc, qf)
      .pipe(this.fireStorageService.mapForPipe('one'));
  }

  /**
   *
   *
   * @param {Iuser} data
   * @return {*}  {Promise<any>}
   * @memberof UserService
   */
  public postDataFS(data: Iuser): Promise<any> {
    return this.fireStorageService.post(this.urlUsers, data);
  }

  /**
   *
   *
   * @param {string} doc
   * @param {Iuser} data
   * @return {*}  {Promise<any>}
   * @memberof UserService
   */
  public patchDataFS(doc: string, data: Iuser): Promise<any> {
    return this.fireStorageService.patch(this.urlUsers, doc, data);
  }

  /**
   *
   *
   * @param {string} doc
   * @return {*}  {Promise<any>}
   * @memberof UserService
   */
  public deleteDataFS(doc: string): Promise<any> {
    return this.fireStorageService.delete(this.urlUsers, doc);
  }

  //------------ FireStorage---------------//
}
