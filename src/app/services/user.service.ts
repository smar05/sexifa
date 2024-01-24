import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Iuser } from '../interface/iuser';
import { FireStorageService } from './fire-storage.service';
import { QueryFn } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private urlUsers: string = environment.urlCollections.users;

  constructor(private fireStorageService: FireStorageService) {}

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
