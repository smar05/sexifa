import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FireStorageService } from './fire-storage.service';
import { QueryFn } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { IFrontLogs } from '../interface/i-front-logs';

@Injectable({
  providedIn: 'root',
})
export class FrontLogsService {
  private urlFrontLogs: string = environment.urlCollections.front_logs;

  constructor(private fireStorageService: FireStorageService) {}

  //------------ FireStorage---------------//
  /**
   * Se toma la informacion de la coleccion de front_logs en Firebase
   *
   *
   * @param {QueryFn} [qf=null]
   * @return {*}  {Observable<any>}
   * @memberof FrontLogsService
   */
  public getDataFS(qf: QueryFn = null): Observable<any> {
    return this.fireStorageService
      .getData(this.urlFrontLogs, qf)
      .pipe(this.fireStorageService.mapForPipe('many'));
  }

  /**
   * Tomar un documento de frontLogs
   *
   * @param {string} doc
   * @param {QueryFn} [qf=null]
   * @return {*}  {Observable<any>}
   * @memberof FrontLogsService
   */
  public getItemFS(doc: string, qf: QueryFn = null): Observable<any> {
    return this.fireStorageService
      .getItem(this.urlFrontLogs, doc, qf)
      .pipe(this.fireStorageService.mapForPipe('one'));
  }

  /**
   * Guardar informacion del frontLogs
   *
   * @param {IFrontLogs} data
   * @return {*}  {Promise<any>}
   * @memberof FrontLogsService
   */
  public postDataFS(data: IFrontLogs): Promise<any> {
    return this.fireStorageService.post(this.urlFrontLogs, data);
  }

  /**
   * Actualizar front_logs
   *
   * @param {string} doc
   * @param {IFrontLogs} data
   * @return {*}  {Promise<any>}
   * @memberof FrontLogsService
   */
  public patchDataFS(doc: string, data: IFrontLogs): Promise<any> {
    return this.fireStorageService.patch(this.urlFrontLogs, doc, data);
  }

  /**
   * Eliminar FrontLogs
   *
   * @param {string} doc
   * @return {*}  {Promise<any>}
   * @memberof FrontLogsService
   */
  public deleteDataFS(doc: string): Promise<any> {
    return this.fireStorageService.delete(this.urlFrontLogs, doc);
  }

  //------------ FireStorage---------------//
}
