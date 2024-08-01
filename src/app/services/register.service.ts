import { Iregister } from './../interface/iregister';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
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
        this.frontLogsService.catchProcessError(
          err,
          {
            title: 'Error',
            text: 'Ha ocurrido un error en la verificacion del email',
            icon: 'error',
          },
          `file: register.service.ts: ~ RegisterService ~ verificEmail ~ JSON.stringify(error): ${JSON.stringify(
            err
          )}`
        );
      });
  }
}
