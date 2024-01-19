import { LocalStorageEnum } from '../enum/localStorageEnum';
import { alerts } from '../helpers/alerts';
import { IFrontLogs } from '../interface/i-front-logs';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { FrontLogsService } from './front-logs.service';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private urlLocation: string = environment.urlLocation;
  private apiKeyLocation: string = environment.apiKeyLocation;
  private headers: Headers = new Headers();

  constructor(private frontLogsService: FrontLogsService) {
    this.headers.append('X-CSCAPI-KEY', this.apiKeyLocation);
    this.headers.append('Access-Control-Allow-Origin', '*');
  }

  /**
   * Consulta de todos los paises
   *
   * @return {*}  {Promise<string>}
   * @memberof LocationService
   */
  public getAllContries(): Promise<string> {
    let requestOptions: any = {
      method: 'GET',
      headers: this.headers,
      redirect: 'follow',
    };
    return fetch(`${this.urlLocation}countries`, requestOptions)
      .then((response: any) => response.text())
      .catch((err: any) => {
        console.error('Error: ', err);
        alerts.basicAlert(
          'Error',
          'Ha ocurrido un error en la consulta de paises',
          'error'
        );

        let data: IFrontLogs = {
          date: new Date(),
          userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
          log: `file: location.service.ts: ~ LocationService ~ getAllContries ~ JSON.stringify(error): ${JSON.stringify(
            err
          )}`,
        };

        this.frontLogsService
          .postDataFS(data)
          .then((res) => {})
          .catch((err) => {
            alerts.basicAlert('Error', 'Error', 'error');
            throw err;
          });
        throw err;
      });
  }

  /**
   * Todos los estados por pais
   *
   * @param {string} iso Iso del pais
   * @return {*}  {Promise<string>}
   * @memberof LocationService
   */
  public getAllStatesByCountry(iso: string): Promise<string> {
    let requestOptions: any = {
      method: 'GET',
      headers: this.headers,
      redirect: 'follow',
    };
    return fetch(`${this.urlLocation}countries/${iso}/states`, requestOptions)
      .then((response: any) => response.text())
      .catch((err: any) => {
        console.error('Error: ', err);
        alerts.basicAlert(
          'Error',
          'Ha ocurrido un error en la consulta de estados',
          'error'
        );
        console.error(err);

        let data: IFrontLogs = {
          date: new Date(),
          userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
          log: `file: location.service.ts: ~ LocationService ~ getAllStatesByCountry ~ JSON.stringify(error): ${JSON.stringify(
            err
          )}`,
        };

        this.frontLogsService
          .postDataFS(data)
          .then((res) => {})
          .catch((err) => {
            alerts.basicAlert('Error', 'Error', 'error');
            throw err;
          });
        throw err;
      });
  }

  /**
   * Todas las ciudades por pais y estado
   *
   * @param {string} isoCountry Iso del pais
   * @param {string} isoState Iso del estado
   * @return {*}  {Promise<string>}
   * @memberof LocationService
   */
  public getAllCitiesByCountryAndState(
    isoCountry: string,
    isoState: string
  ): Promise<string> {
    let requestOptions: any = {
      method: 'GET',
      headers: this.headers,
      redirect: 'follow',
    };
    return fetch(
      `${this.urlLocation}countries/${isoCountry}/states/${isoState}/cities`,
      requestOptions
    )
      .then((response: any) => response.text())
      .catch((err: any) => {
        console.error('Error: ', err);
        alerts.basicAlert(
          'Error',
          'Ha ocurrido un error en la consulta de ciudades',
          'error'
        );
        console.error(err);

        let data: IFrontLogs = {
          date: new Date(),
          userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
          log: `file: location.service.ts: ~ LocationService ~ JSON.stringify(error): ${JSON.stringify(
            err
          )}`,
        };

        this.frontLogsService
          .postDataFS(data)
          .then((res) => {})
          .catch((err) => {
            alerts.basicAlert('Error', 'Error', 'error');
            throw err;
          });
        throw err;
      });
  }
}
