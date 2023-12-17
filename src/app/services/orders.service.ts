import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FireStorageService } from './fire-storage.service';
import { QueryFn } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Iorders } from '../interface/i-orders';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private urlOrders: string = environment.urlCollections.orders;

  constructor(private fireStorageService: FireStorageService) {}

  //------------ FireStorage---------------//
  /**
   * Se toma la informacion de la coleccion de Orders en Firebase
   *
   * @param {QueryFn} [qf=null]
   * @return {*}  {Observable<any>}
   * @memberof OrdersService
   */
  public getDataFS(qf: QueryFn = null): Observable<any> {
    return this.fireStorageService
      .getData(this.urlOrders, qf)
      .pipe(this.fireStorageService.mapForPipe('many'));
  }

  /**
   * Tomar un documento de Orders
   *
   * @param {string} doc
   * @param {QueryFn} [qf=null]
   * @return {*}  {Observable<any>}
   * @memberof OrdersService
   */
  public getItemFS(doc: string, qf: QueryFn = null): Observable<any> {
    return this.fireStorageService
      .getItem(this.urlOrders, doc, qf)
      .pipe(this.fireStorageService.mapForPipe('one'));
  }

  /**
   * Guardar informacion del Orders
   *
   * @param {Iorders} data
   * @return {*}  {Promise<any>}
   * @memberof OrdersService
   */
  public postDataFS(data: Iorders): Promise<any> {
    return this.fireStorageService.post(this.urlOrders, data);
  }

  /**
   * Actualizar Orders
   *
   * @param {string} doc
   * @param {Iorders} data
   * @return {*}  {Promise<any>}
   * @memberof OrdersService
   */
  public patchDataFS(doc: string, data: Iorders): Promise<any> {
    return this.fireStorageService.patch(this.urlOrders, doc, data);
  }

  /**
   * Eliminar Orders
   *
   * @param {string} doc
   * @return {*}  {Promise<any>}
   * @memberof OrdersService
   */
  public deleteDataFS(doc: string): Promise<any> {
    return this.fireStorageService.delete(this.urlOrders, doc);
  }

  //------------ FireStorage---------------//
}
