import { AngularFireAuth } from '@angular/fire/compat/auth';
import { environment } from './../../environments/environment';
import { Ilogin } from './../interface/ilogin';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocalStorageEnum } from '../enum/localStorageEnum';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient, private afAuth: AngularFireAuth) {}

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
        console.log(
          '🚀 ~ file: login.service.ts ~ line 32 ~ LoginService ~ map ~ resp',
          resp
        );
        //Se captura el idToken y refreshToken
        localStorage.setItem(LocalStorageEnum.TOKEN, resp.idToken);
        localStorage.setItem(LocalStorageEnum.REFRESH_TOKEN, resp.refreshToken);

        //Se captura el localId
        localStorage.setItem(LocalStorageEnum.LOCAL_ID, resp.localId);
      })
    );
  }

  /**
   *
   *
   * @param {Ilogin} data
   * @return {*}  {Promise<any>}
   * @memberof LoginService
   */
  public loginWithAuthFire(data: Ilogin): Promise<any> {
    return this.afAuth.signInWithEmailAndPassword(data.email, data.password);
  }
}
