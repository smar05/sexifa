import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FireStorageService } from './fire-storage.service';
import { QueryFn } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { IMetodosDePago } from '../interface/i-metodos-de-pago';

@Injectable({
  providedIn: 'root',
})
export class MetodosDePagoService {
  private urlMetodosDePago: string = environment.urlCollections.metodos_de_pago;

  constructor(private fireStorageService: FireStorageService) {}

  //------------ FireStorage---------------//
  /**
   * Se toma la informacion de la coleccion en Firebase
   *
   * @param {QueryFn} [qf=null]
   * @return {*}  {Observable<any>}
   * @memberof MetodosDePagoService
   */
  public getDataFS(qf: QueryFn = null): Observable<any> {
    return this.fireStorageService
      .getData(this.urlMetodosDePago, qf)
      .pipe(this.fireStorageService.mapForPipe('many'));
  }

  /**
   * Tomar un documento
   *
   * @param {string} doc
   * @param {QueryFn} [qf=null]
   * @return {*}  {Observable<any>}
   * @memberof MetodosDePagoService
   */
  public getItemFS(doc: string, qf: QueryFn = null): Observable<any> {
    return this.fireStorageService
      .getItem(this.urlMetodosDePago, doc, qf)
      .pipe(this.fireStorageService.mapForPipe('one'));
  }

  /**
   * Guardar informacion
   *
   * @param {IMetodosDePago} data
   * @return {*}  {Promise<any>}
   * @memberof SubscriptionssService
   */
  public postDataFS(data: IMetodosDePago): Promise<any> {
    return this.fireStorageService.post(this.urlMetodosDePago, data);
  }

  /**
   * Actualizar
   *
   * @param {string} doc
   * @param {IMetodosDePago} data
   * @return {*}  {Promise<any>}
   * @memberof MetodosDePagoService
   */
  public patchDataFS(doc: string, data: IMetodosDePago): Promise<any> {
    return this.fireStorageService.patch(this.urlMetodosDePago, doc, data);
  }

  /**
   * Eliminar
   *
   * @param {string} doc
   * @return {*}  {Promise<any>}
   * @memberof MetodosDePagoService
   */
  public deleteDataFS(doc: string): Promise<any> {
    return this.fireStorageService.delete(this.urlMetodosDePago, doc);
  }

  public updateDocuments(updates: { doc: string; data: any }[]): Promise<void> {
    return this.fireStorageService.updateDocuments(
      this.urlMetodosDePago,
      updates
    );
  }

  //------------ FireStorage---------------//
}
