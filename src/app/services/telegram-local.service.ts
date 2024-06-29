import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { alerts } from '../helpers/alerts';
import { IFrontLogs } from '../interface/i-front-logs';
import { LocalStorageEnum } from '../enum/localStorageEnum';
import { FrontLogsService } from './front-logs.service';

@Injectable({
  providedIn: 'root',
})
export class TelegramLocalService {
  private url: string = `${environment.urlServidorLocal}/api/${environment.urlsServidor.urlTelegramApi}`;

  constructor(
    private http: HttpClient,
    private frontLogsService: FrontLogsService
  ) {}

  /**
   * Probar la conexion entre el cliente y el bot de telegram
   *
   * @param {*} body
   * @return {*}  {Observable<any>}
   * @memberof TelegramLocalService
   */
  public getPruebaBotCliente(params: any = {}): Observable<any> {
    return this.http.get(`${this.url}/comunicar-bot-cliente`, { params });
  }

  /**
   * Consultar si un usuario ya pertenece al grupo
   *
   * @param {*} params
   * @return {*}  {Observable<any>}
   * @memberof TelegramLocalService
   */
  public esMiembroDelGrupo(params: any): Observable<any> {
    return this.http.get(`${this.url}/es-miembro-del-grupo`, { params });
  }

  /**
   * Consulta si el bot pertenece a un grupo y es admin
   *
   * @param {{chatId:number}} params
   * @return {*}  {Observable<boolean>}
   * @memberof TelegramLocalService
   */
  public botEsAdminDelGrupo(params: { chatId: number }): Observable<boolean> {
    return this.http.get(`${this.url}/bot-es-admin-del-grupo`, {
      params,
    }) as Observable<boolean>;
  }

  /**
   * Enviar los links de acceso a los grupos de la orden
   *
   * @param {*} [params]
   * @return {*}  {Observable<any>}
   * @memberof TelegramLocalService
   */
  public getLinksOrden(params: any): Observable<any> {
    return this.http.get(`${this.url}/enviar-link`, { params });
  }

  // Servicios

  /**
   *
   *
   * @param {(string  | number)} fromId
   * @return {*}  {Promise<void>}
   * @memberof TelegramLocalService
   */
  public async probarConexionBot(fromId: number = 0): Promise<void> {
    let res: any = null;

    try {
      res = await this.getPruebaBotCliente({ fromId }).toPromise();
    } catch (error) {
      console.error('Error: ', error);
      alerts.basicAlert(
        'Error',
        'Ha ocurrido un error probando la conexion con el bot de Telegram',
        'error'
      );

      let data: IFrontLogs = {
        date: new Date(),
        userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
        log: `file: telegram-local.service.ts: ~ TelegramLocalService ~ probarConexionBot ~ JSON.stringify(error): ${JSON.stringify(
          error
        )}`,
      };

      this.frontLogsService
        .postDataFS(data)
        .then((res) => {})
        .catch((err) => {
          alerts.basicAlert('Error', 'Error', 'error');
          throw err;
        });
      throw error;
    }

    if (res.code == 200) {
      alerts.basicAlert(
        'Mensaje enviado',
        'Revisa tu chat de Telegram, nuestro bot te envio un mensaje',
        'success'
      );
    } else {
      alerts.basicAlert(
        'Mensaje erroneo',
        'No se ha podido conectar tu chat de Telegram, revisa que el Id de tu chat de Telegram este correcto',
        'error'
      );
    }
  }
}
