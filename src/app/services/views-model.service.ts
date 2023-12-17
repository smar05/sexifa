import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FireStorageService } from './fire-storage.service';
import { QueryFn } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { IviewsModel } from '../interface/i-views-model';

@Injectable({
  providedIn: 'root',
})
export class ViewsModelService {
  private urlViewsModel: string = environment.urlCollections.views_model;

  constructor(private fireStorageService: FireStorageService) {}

  //------------ FireStorage---------------//
  /**
   * Se toma la informacion de la coleccion de vistas en Firebase
   *
   * @param {QueryFn} [qf=null]
   * @return {*}  {Observable<any>}
   * @memberof ViewsModelService
   */
  public getDataFS(qf: QueryFn = null): Observable<any> {
    return this.fireStorageService
      .getData(this.urlViewsModel, qf)
      .pipe(this.fireStorageService.mapForPipe('many'));
  }

  /**
   * Tomar un documento de vistas
   *
   * @param {string} doc
   * @param {QueryFn} [qf=null]
   * @return {*}  {Observable<any>}
   * @memberof ViewsModelService
   */
  public getItemFS(doc: string, qf: QueryFn = null): Observable<any> {
    return this.fireStorageService
      .getItem(this.urlViewsModel, doc, qf)
      .pipe(this.fireStorageService.mapForPipe('one'));
  }

  /**
   * Guardar informacion del vistas
   *
   * @param {IviewsModel} data
   * @return {*}  {Promise<any>}
   * @memberof ViewsModelService
   */
  public postDataFS(data: IviewsModel): Promise<any> {
    return this.fireStorageService.post(this.urlViewsModel, data);
  }

  /**
   * Actualizar vistas
   *
   * @param {string} doc
   * @param {IviewsModel} data
   * @return {*}  {Promise<any>}
   * @memberof ViewsModelService
   */
  public patchDataFS(doc: string, data: IviewsModel): Promise<any> {
    return this.fireStorageService.patch(this.urlViewsModel, doc, data);
  }

  /**
   * Eliminar vistas
   *
   * @param {string} doc
   * @return {*}  {Promise<any>}
   * @memberof ViewsModelService
   */
  public deleteDataFS(doc: string): Promise<any> {
    return this.fireStorageService.delete(this.urlViewsModel, doc);
  }

  //------------ FireStorage---------------//
}
