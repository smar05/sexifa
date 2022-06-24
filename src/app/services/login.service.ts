import { environment } from './../../environments/environment';
import { Ilogin } from './../interface/ilogin';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}

  /**
   *  Autenticacion de firebase
   *
   * @param {Ilogin} data
   * @return {*}  {Observable<any>}
   * @memberof LoginService
   */
  public login(data: Ilogin): Observable<any> {
    return this.http.post(environment.urlLogin, data).pipe(
      map((resp: any) => {
        //Se captura el idToken y refreshToken
        localStorage.setItem('token', resp.idToken);
        localStorage.setItem('refreshToken', resp.refreshToken);

        //Se captura el localId
        localStorage.setItem('localId', resp.localId);
      })
    );
  }
}
