import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FireStorageService } from './fire-storage.service';
import { QueryFn } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

export enum EnumBusinessParamsKeys {
  PUBLIC_KEY = 'public_key',
  COMMISSION = 'commission',
  FRONT_DATA = 'front_data',
}

@Injectable({
  providedIn: 'root',
})
export class BusinessParamsService {
  private urlBusinessParams: string =
    environment.urlCollections.business_params;

  constructor(private fireStorageService: FireStorageService) {}

  //------------ FireStorage---------------//
  /**
   * Se toma la informacion de la coleccion
   *
   * @param {QueryFn} [qf=null]
   * @return {*}  {Observable<any>}
   * @memberof BusinessParamsService
   */
  public getDataFS(qf: QueryFn = null): Observable<any> {
    return this.fireStorageService
      .getData(this.urlBusinessParams, qf)
      .pipe(this.fireStorageService.mapForPipe('many'));
  }

  /**
   * Tomar un documento
   *
   * @param {EnumBusinessParamsKeys} doc
   * @param {QueryFn} [qf=null]
   * @return {*}  {Observable<any>}
   * @memberof BusinessParamsService
   */
  public getItemFS(
    doc: EnumBusinessParamsKeys,
    qf: QueryFn = null
  ): Observable<any> {
    return this.fireStorageService
      .getItem(this.urlBusinessParams, doc, qf)
      .pipe(this.fireStorageService.mapForPipe('one'));
  }

  /**
   * Guardar informacion
   *
   * @param {any} data
   * @return {*}  {Promise<any>}
   * @memberof BusinessParamsService
   */
  public postDataFS(data: any): Promise<any> {
    return this.fireStorageService.post(this.urlBusinessParams, data);
  }

  /**
   * Actualizar
   *
   * @param {string} doc
   * @param {any} data
   * @return {*}  {Promise<any>}
   * @memberof BusinessParamsService
   */
  public patchDataFS(doc: string, data: any): Promise<any> {
    return this.fireStorageService.patch(this.urlBusinessParams, doc, data);
  }

  /**
   * Eliminar
   *
   * @param {string} doc
   * @return {*}  {Promise<any>}
   * @memberof BusinessParamsService
   */
  public deleteDataFS(doc: string): Promise<any> {
    return this.fireStorageService.delete(this.urlBusinessParams, doc);
  }

  //------------ FireStorage---------------//
}
