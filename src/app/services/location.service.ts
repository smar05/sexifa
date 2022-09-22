import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private urlLocation: string = environment.urlLocation;
  private apiKeyLocation: string = environment.apiKeyLocation;
  private headers: Headers = new Headers();

  constructor() {
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
        console.error(err);
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
        console.error(err);
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
        console.error(err);
      });
  }
}
