import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FireStorageService } from './fire-storage.service';
import { QueryFn } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Isubscriptions } from '../interface/i- subscriptions';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionsService {
  private urlSubscriptions: string = environment.urlCollections.subscriptions;

  constructor(private fireStorageService: FireStorageService) {}

  //------------ FireStorage---------------//
  /**
   * Se toma la informacion de la coleccion de subscriptions en Firebase
   *
   * @param {QueryFn} [qf=null]
   * @return {*}  {Observable<any>}
   * @memberof SubscriptionsService
   */
  public getDataFS(qf: QueryFn = null): Observable<any> {
    return this.fireStorageService
      .getData(this.urlSubscriptions, qf)
      .pipe(this.fireStorageService.mapForPipe('many'));
  }

  /**
   * Tomar un documento de subscriptions
   *
   * @param {string} doc
   * @param {QueryFn} [qf=null]
   * @return {*}  {Observable<any>}
   * @memberof SubscriptionsService
   */
  public getItemFS(doc: string, qf: QueryFn = null): Observable<any> {
    return this.fireStorageService
      .getItem(this.urlSubscriptions, doc, qf)
      .pipe(this.fireStorageService.mapForPipe('one'));
  }

  /**
   * Guardar informacion del subscriptions
   *
   * @param {Isubscriptions} data
   * @return {*}  {Promise<any>}
   * @memberof SubscriptionssService
   */
  public postDataFS(data: Isubscriptions): Promise<any> {
    return this.fireStorageService.post(this.urlSubscriptions, data);
  }

  /**
   * Actualizar subscriptions
   *
   * @param {string} doc
   * @param {Isubscriptions} data
   * @return {*}  {Promise<any>}
   * @memberof SubscriptionsService
   */
  public patchDataFS(doc: string, data: Isubscriptions): Promise<any> {
    return this.fireStorageService.patch(this.urlSubscriptions, doc, data);
  }

  /**
   * Eliminar subscriptions
   *
   * @param {string} doc
   * @return {*}  {Promise<any>}
   * @memberof SubscriptionsService
   */
  public deleteDataFS(doc: string): Promise<any> {
    return this.fireStorageService.delete(this.urlSubscriptions, doc);
  }

  public updateDocuments(updates: { doc: string; data: any }[]): Promise<void> {
    return this.fireStorageService.updateDocuments(
      this.urlSubscriptions,
      updates
    );
  }

  //------------ FireStorage---------------//
}
