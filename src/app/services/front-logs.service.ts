import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FireStorageService } from './fire-storage.service';
import { QueryFn } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { IFrontLogs } from '../interface/i-front-logs';
import { alerts } from '../helpers/alerts';
import { SweetAlertIcon } from 'sweetalert2';
import { functions } from '../helpers/functions';
import { VariablesGlobalesService } from './variables-globales.service';
import { EnumVariablesGlobales } from '../enum/enum-variables-globales';

@Injectable({
  providedIn: 'root',
})
export class FrontLogsService {
  private urlFrontLogs: string = environment.urlCollections.front_logs;

  constructor(
    private fireStorageService: FireStorageService,
    private variablesGlobalesService: VariablesGlobalesService
  ) {}

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

  /**
   * Metodo comun para procesar la informacion de los catch
   *
   * @param {*} error
   * @param {{ title: string; text: string; icon: SweetAlertIcon }} alertData
   * @param {string} log
   * @memberof FrontLogsService
   */
  public catchProcessError(
    error: any,
    alertData: { title: string; text: string; icon: SweetAlertIcon },
    log: string
  ): void {
    console.error('Error: ', error);
    alerts.basicAlert(alertData.title, alertData.text, alertData.icon);

    let data: IFrontLogs = {
      date: new Date(),
      userId: this.variablesGlobalesService.getCurrentValue(
        EnumVariablesGlobales.USER_ID
      ),
      log,
    };

    this.postDataFS(data)
      .then((res) => {})
      .catch((err) => {
        alerts.basicAlert('Error', 'Error', 'error');
        throw err;
      });

    functions.bloquearPantalla(false);

    throw error;
  }
}
