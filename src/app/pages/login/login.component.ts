import { UrlPagesEnum } from './../../enum/urlPagesEnum';
import { LoginService } from './../../services/login.service';
import { Ilogin } from './../../interface/ilogin';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { alerts } from 'src/app/helpers/alerts';
import { functions } from 'src/app/helpers/functions';
import { Router } from '@angular/router';
//import '../../shared/spinkit/sk-folding-cube.css';
import { LocalStorageEnum } from 'src/app/enum/localStorageEnum';
import { UserService } from 'src/app/services/user.service';
import { Iuser } from 'src/app/interface/iuser';
import { IQueryParams } from 'src/app/interface/i-query-params';
import { UserStatusEnum } from 'src/app/enum/userStatusEnum';
import { UserTypeEnum } from 'src/app/enum/userTypeEnum';
import { QueryFn } from '@angular/fire/compat/firestore';
import { IFireStoreRes } from 'src/app/interface/ifireStoreRes';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  //Grupo de controles
  public f: any = this.form.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  public loading: boolean = false;
  public formSubmitted: boolean = false;

  constructor(
    private form: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {}

  public login(): void {
    this.formSubmitted = true; //Formulario enviado

    //Formulario correcto
    if (this.f.invalid) {
      return;
    }

    //Capturamos la informacion del formulario de la interfaz
    const data: Ilogin = {
      email: this.f.controls.email.value,
      password: this.f.controls.password.value,
      returnSecureToken: true,
    };

    //Servicio de login
    this.loading = true;
    this.loginService
      .loginWithAuthFire(data)
      .then(async (res: any) => {
        if (!res.user.multiFactor.user.emailVerified) {
          alerts.basicAlert(
            'Error',
            'La cuenta no ha sido verificada',
            'error'
          );
          this.loading = false;
          return;
        }

        //Se captura el idToken y refreshToken
        localStorage.setItem(
          LocalStorageEnum.TOKEN,
          res.user.multiFactor.user.stsTokenManager.accessToken
        );
        localStorage.setItem(
          LocalStorageEnum.REFRESH_TOKEN,
          res.user.multiFactor.user.stsTokenManager.refreshToken
        );

        //Se captura el localId
        localStorage.setItem(
          LocalStorageEnum.LOCAL_ID,
          res.user.multiFactor.user.uid
        );

        let qf: QueryFn = (ref) =>
          ref.where(
            'id',
            '==',
            localStorage.getItem(LocalStorageEnum.LOCAL_ID)
          );

        let user: Iuser = (await this.userService.getDataFS(qf).toPromise())[0]
          .data;

        // Verificar el estado del usuario
        switch (user.status) {
          case UserStatusEnum.INACTIVO:
            alerts.basicAlert('Error', 'Usuario inactivo', 'error');
            this.logout();
            return;

          case UserStatusEnum.PENDIENTE_CONFIRMAR:
            alerts.basicAlert(
              'Error',
              'Cuenta pendiente de activacion, contacte a un asesor para mayor informacion',
              'error'
            );
            this.logout();
            return;
        }

        //Entramos al sistema
        let url: string;

        switch (user.type) {
          case UserTypeEnum.USUARIO:
            localStorage.setItem(
              LocalStorageEnum.USER_TYPE,
              UserTypeEnum.USUARIO
            );
            url = `/${UrlPagesEnum.HOME}`;
            break;

          case UserTypeEnum.VENDEDOR:
            localStorage.setItem(
              LocalStorageEnum.USER_TYPE,
              UserTypeEnum.VENDEDOR
            );
            url = `/${UrlPagesEnum.HOME_SELLER}`;
            break;

          default:
            url = `/${UrlPagesEnum.LOGIN}`;
            break;
        }

        this.router.navigateByUrl(url);
        this.loading = false;
      })
      .catch((err: any) => {
        //Errores al ingresar
        let error: any = err.code;

        switch (error) {
          case 'auth/invalid-email':
            alerts.basicAlert(
              'Error',
              'El formato del correo electrónico es inválido.',
              'error'
            );
            break;
          case 'auth/user-disabled':
            alerts.basicAlert(
              'Error',
              'La cuenta de usuario está deshabilitada.',
              'error'
            );
            break;
          case 'auth/wrong-password':
            alerts.basicAlert('Error', 'Contraseña incorrecta.', 'error');
            break;
          default:
            alerts.basicAlert('Error', 'Error en el inicio de sesión', 'error');
            break;
        }

        this.loading = false;
      });
  }

  //Funcion de salida del sistema
  public logout(): void {
    this.loginService.logout();
  }

  /**
   *Validacion del formulario
   *
   * @param {string} field
   * @return {*}  {boolean}
   * @memberof LoginComponent
   */
  public invalidField(field: string): boolean {
    return functions.invalidField(field, this.f, this.formSubmitted);
  }
}
