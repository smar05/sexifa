import { environment } from './../../environments/environment';
import { Icategories } from './../interface/icategories';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { FireStorageService } from './fire-storage.service';
import { QueryFn } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private urlCategories: string = environment.urlCollections.categories;

  constructor(private fireStorageService: FireStorageService) {}

  //------------ FireStorage---------------//
  /**
   * Se toma la informacion de la coleccion de front_logs en Firebase
   *
   *
   * @param {QueryFn} [qf=null]
   * @return {*}  {Observable<any>}
   * @memberof CategoriesService
   */
  public getDataFS(qf: QueryFn = null): Observable<any> {
    return this.fireStorageService
      .getData(this.urlCategories, qf)
      .pipe(this.fireStorageService.mapForPipe('many'));
  }

  /**
   * Tomar un documento de frontLogs
   *
   * @param {string} doc
   * @param {QueryFn} [qf=null]
   * @return {*}  {Observable<any>}
   * @memberof CategoriesService
   */
  public getItemFS(doc: string, qf: QueryFn = null): Observable<any> {
    return this.fireStorageService
      .getItem(this.urlCategories, doc, qf)
      .pipe(this.fireStorageService.mapForPipe('one'));
  }

  /**
   * Guardar informacion del frontLogs
   *
   * @param {Icategories} data
   * @return {*}  {Promise<any>}
   * @memberof CategoriesService
   */
  public postDataFS(data: Icategories): Promise<any> {
    return this.fireStorageService.post(this.urlCategories, data);
  }

  /**
   * Actualizar front_logs
   *
   * @param {string} doc
   * @param {Icategories} data
   * @return {*}  {Promise<any>}
   * @memberof CategoriesService
   */
  public patchDataFS(doc: string, data: Icategories): Promise<any> {
    return this.fireStorageService.patch(this.urlCategories, doc, data);
  }

  /**
   * Eliminar FrontLogs
   *
   * @param {string} doc
   * @return {*}  {Promise<any>}
   * @memberof CategoriesService
   */
  public deleteDataFS(doc: string): Promise<any> {
    return this.fireStorageService.delete(this.urlCategories, doc);
  }

  //------------ FireStorage---------------//
}
