import { Observable } from 'rxjs';
import { Iregister } from './../interface/iregister';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { alerts } from '../helpers/alerts';
import { IFrontLogs } from '../interface/i-front-logs';
import { LocalStorageEnum } from '../enum/localStorageEnum';
import { FrontLogsService } from './front-logs.service';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(
    private afAuth: AngularFireAuth,
    private frontLogsService: FrontLogsService
  ) {}

  /**
   * Registro en firebase
   *
   * @param {Iregister} data
   * @return {*}  {Promise<any>}
   * @memberof RegisterService
   */
  public registerAuth(data: Iregister): Promise<any> {
    return this.afAuth.createUserWithEmailAndPassword(
      data.email,
      data.password
    );
  }

  /**
   * Enviar correo para restaurar contraseña de usuario
   *
   * @param {string} email
   * @return {*}  {Promise<void>}
   * @memberof RegisterService
   */
  public forgotPassword(email: string): Promise<void> {
    return this.afAuth.sendPasswordResetEmail(email);
  }

  /**
   * Verificar el email registrado
   *
   * @return {*}  {Promise<any>}
   * @memberof RegisterService
   */
  public verificEmail(): Promise<any> {
    return this.afAuth.currentUser
      .then((user: any) => {
        user.sendEmailVerification();
      })
      .catch((err) => {
        console.error('Error: ', err);
        alerts.basicAlert(
          'Error',
          'Ha ocurrido un error en la verificacion del email',
          'error'
        );

        let data: IFrontLogs = {
          date: new Date(),
          userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
          log: `file: register.service.ts: ~ RegisterService ~ verificEmail ~ JSON.stringify(error): ${JSON.stringify(
            err
          )}`,
        };

        this.frontLogsService
          .postDataFS(data)
          .then((res) => {})
          .catch((err) => {
            alerts.basicAlert('Error', 'Error', 'error');
          });
      });
  }
}
