import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FireStorageService } from './fire-storage.service';
import { QueryFn } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { ISaldos } from '../interface/i-saldos';

@Injectable({
  providedIn: 'root',
})
export class SaldosService {
  private urlSaldos: string = environment.urlCollections.saldos;

  constructor(private fireStorageService: FireStorageService) {}

  //------------ FireStorage---------------//
  /**
   * Se toma la informacion de la coleccion en Firebase
   *
   * @param {QueryFn} [qf=null]
   * @return {*}  {Observable<any>}
   * @memberof SaldosService
   */
  public getDataFS(qf: QueryFn = null): Observable<any> {
    return this.fireStorageService
      .getData(this.urlSaldos, qf)
      .pipe(this.fireStorageService.mapForPipe('many'));
  }

  /**
   * Tomar un documento
   *
   * @param {string} doc
   * @param {QueryFn} [qf=null]
   * @return {*}  {Observable<any>}
   * @memberof SaldosService
   */
  public getItemFS(doc: string, qf: QueryFn = null): Observable<any> {
    return this.fireStorageService
      .getItem(this.urlSaldos, doc, qf)
      .pipe(this.fireStorageService.mapForPipe('one'));
  }

  /**
   * Guardar informacion
   *
   * @param {ISaldos} data
   * @return {*}  {Promise<any>}
   * @memberof SubscriptionssService
   */
  public postDataFS(data: ISaldos): Promise<any> {
    return this.fireStorageService.post(this.urlSaldos, data);
  }

  /**
   * Actualizar
   *
   * @param {string} doc
   * @param {ISaldos} data
   * @return {*}  {Promise<any>}
   * @memberof SaldosService
   */
  public patchDataFS(doc: string, data: ISaldos): Promise<any> {
    return this.fireStorageService.patch(this.urlSaldos, doc, data);
  }

  /**
   * Eliminar
   *
   * @param {string} doc
   * @return {*}  {Promise<any>}
   * @memberof SaldosService
   */
  public deleteDataFS(doc: string): Promise<any> {
    return this.fireStorageService.delete(this.urlSaldos, doc);
  }

  //------------ FireStorage---------------//
}
