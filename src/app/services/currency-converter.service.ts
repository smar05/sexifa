import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CurrencyConverterService {
  private urlCurrencyConverter: string = environment.urlCurrencyConverter;

  constructor(private http: HttpClient) {}

  /**
   * Convertir tipo de moneda
   *
   * @param {string} currency formato ejemplo USD_COP
   * @param {number} amount Cantidad a convertir
   * @return {*}  {Observable<any>}
   * @memberof CurrencyConverterService
   */
  public getCurrencyConverter(
    currency: string,
    amount: number
  ): Observable<any> {
    let fromCurrency: string = currency.split('_')[0];
    let toCurrency: string = currency.split('_')[1];

    return this.http.get(
      `${this.urlCurrencyConverter}/v2/currency/convert?api_key=${environment.apiKeyCurrencyConverter}&from=${fromCurrency}&to=${toCurrency}&amount=${amount}&format=json`
    );
  }
}
