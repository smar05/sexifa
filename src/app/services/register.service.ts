import { Observable } from 'rxjs';
import { Iregister } from './../interface/iregister';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(private afAuth: AngularFireAuth) {}

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
    return this.afAuth.currentUser.then((user: any) => {
      user.sendEmailVerification();
    });
  }
}
