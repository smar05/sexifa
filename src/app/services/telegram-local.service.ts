import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { alerts } from '../helpers/alerts';

@Injectable({
  providedIn: 'root',
})
export class TelegramLocalService {
  private url: string = `${environment.urlServidorLocal}/api/telegram`;

  constructor(private http: HttpClient) {}

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
    let res: any = await this.getPruebaBotCliente({ fromId }).toPromise();

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
