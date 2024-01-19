import { AngularFireAuth } from '@angular/fire/compat/auth';
import { environment } from './../../environments/environment';
import { Ilogin } from './../interface/ilogin';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocalStorageEnum } from '../enum/localStorageEnum';
import { UrlPagesEnum } from '../enum/urlPagesEnum';
import { Router } from '@angular/router';
import { alerts } from '../helpers/alerts';
import { IFrontLogs } from '../interface/i-front-logs';
import { FrontLogsService } from './front-logs.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(
    private http: HttpClient,
    private afAuth: AngularFireAuth,
    private router: Router,
    private frontLogsService: FrontLogsService
  ) {}

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

  /**
   * Método para obtener el token de autenticación
   *
   * @return {*}  {*}
   * @memberof LoginService
   */
  public getAuthToken(): any {
    return this.afAuth.currentUser
      .then((user) => user?.getIdToken())
      .catch((err) => {
        console.error('Error: ', err);
        alerts.basicAlert(
          'Error',
          'Ha ocurrido un error en la consulta del token',
          'error'
        );

        let data: IFrontLogs = {
          date: new Date(),
          userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
          log: `file: login.service.ts:81 ~ LoginService ~ getAuthToken ~ JSON.stringify(error): ${JSON.stringify(
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
   * Funcion de salida del sistema
   *
   * @memberof LoginService
   */
  public logout(): void {
    localStorage.clear();

    this.router.navigateByUrl(`/${UrlPagesEnum.LOGIN}`);
  }
}
