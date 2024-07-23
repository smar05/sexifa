import { UrlPagesEnum } from './../../enum/urlPagesEnum';
import { LoginService } from './../../services/login.service';
import { Ilogin } from './../../interface/ilogin';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { alerts } from 'src/app/helpers/alerts';
import { functions } from 'src/app/helpers/functions';
import { Router } from '@angular/router';
import { LocalStorageEnum } from 'src/app/enum/localStorageEnum';
import { UserService } from 'src/app/services/user.service';
import { Iuser } from 'src/app/interface/iuser';
import { UserStatusEnum } from 'src/app/enum/userStatusEnum';
import { UserTypeEnum } from 'src/app/enum/userTypeEnum';
import { QueryFn } from '@angular/fire/compat/firestore';
import { FrontLogsService } from 'src/app/services/front-logs.service';
import { ModelsService } from 'src/app/services/models.service';
import { Imodels } from 'src/app/interface/imodels';
import { IFireStoreRes } from 'src/app/interface/ifireStoreRes';
import { EnumExpresioncesRegulares } from 'src/app/enum/EnumExpresionesRegulares';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  //Grupo de controles
  public f: any = this.form.group({
    email: [
      '',
      [
        Validators.required,
        Validators.email,
        Validators.maxLength(320),
        Validators.pattern(EnumExpresioncesRegulares.EMAIL),
      ],
    ],
    password: [
      '',
      [
        Validators.required,
        Validators.maxLength(128),
        Validators.minLength(8),
        Validators.pattern(EnumExpresioncesRegulares.PASSWORD),
      ],
    ],
  });

  public loading: boolean = false;
  public formSubmitted: boolean = false;

  constructor(
    private form: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private userService: UserService,
    private frontLogsService: FrontLogsService,
    private modelsService: ModelsService
  ) {}

  ngOnInit(): void {
    functions.bloquearPantalla(true);
    let auxRedirectTo: string = localStorage.getItem(
      LocalStorageEnum.REDIRECT_TO
    );
    localStorage.clear();

    if (auxRedirectTo) {
      localStorage.setItem(LocalStorageEnum.REDIRECT_TO, auxRedirectTo);
      alerts.basicAlert('Info', 'Debes acceder a tu cuenta primero', 'info');
    }
    functions.bloquearPantalla(false);
  }

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
    functions.bloquearPantalla(true);
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
          functions.bloquearPantalla(false);
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
          ref
            .where('id', '==', localStorage.getItem(LocalStorageEnum.LOCAL_ID))
            .limit(1);

        let user: Iuser = {} as any;
        let userIdDoc: string = null;

        try {
          let data: IFireStoreRes[] = await this.userService
            .getDataFS(qf)
            .toPromise();
          user = { ...data[0].data };
          userIdDoc = data[0].id;
        } catch (error) {
          this.frontLogsService.catchProcessError(
            error,
            {
              title: 'Error',
              text: 'Ha ocurrido un error en la consulta de usuarios',
              icon: 'error',
            },
            `file: login.component.ts: ~ LoginComponent ~ JSON.stringify(error): ${JSON.stringify(
              error
            )}`
          );
          this.loading = false;
        }

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
            let pathRedirectTo: string = localStorage.getItem(
              LocalStorageEnum.REDIRECT_TO
            );

            if (pathRedirectTo) {
              url = pathRedirectTo;
              break;
            }

            url = `/${UrlPagesEnum.HOME}`;
            break;

          case UserTypeEnum.CREADOR:
            localStorage.setItem(
              LocalStorageEnum.USER_TYPE,
              UserTypeEnum.CREADOR
            );

            let model: Imodels = null;
            let data: IFireStoreRes[] = null;
            try {
              let qf: QueryFn = (ref) =>
                ref.where(
                  'idUser',
                  '==',
                  localStorage.getItem(LocalStorageEnum.LOCAL_ID)
                );
              data = await this.modelsService.getDataFS(qf).toPromise();
            } catch (error) {
              this.frontLogsService.catchProcessError(
                error,
                {
                  title: 'Error',
                  text: 'Ha ocurrido un error en la consulta de usuarios',
                  icon: 'error',
                },
                `file: login.component.ts: ~ LoginComponent ~ JSON.stringify(error): ${JSON.stringify(
                  error
                )}`
              );

              this.loading = false;
            }

            if (!data) throw 'Error';

            model = data[0].data;
            model.id = data[0].id;

            if (model && model.id) {
              localStorage.setItem(LocalStorageEnum.MODEL_ID, model.id);
            }

            url = `/${UrlPagesEnum.HOME_SELLER}`;
            break;

          default:
            url = `/${UrlPagesEnum.LOGIN}`;
            break;
        }

        try {
          user.last_login = new Date().toISOString();

          let data: Iuser = user;
          await this.userService.patchDataFS(userIdDoc, data);
        } catch (error) {
          this.frontLogsService.catchProcessError(
            error,
            {
              title: 'Error',
              text: 'Ha ocurrido un error guardando al usuario',
              icon: 'error',
            },
            `file: login.component.ts: ~ LoginComponent ~ JSON.stringify(error): ${JSON.stringify(
              error
            )}`
          );

          this.loading = false;
        }

        this.router.navigateByUrl(url);
        functions.bloquearPantalla(false);
        this.loading = false;
      })
      .catch((err: any) => {
        console.error('Error: ', err);
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

        this.frontLogsService.catchProcessError(
          error,
          {
            title: 'Error',
            text: 'Ha ocurrido un error en el login',
            icon: 'error',
          },
          `file: login.component.ts: ~ LoginComponent ~ login ~ JSON.stringify(error): ${JSON.stringify(
            error
          )}`
        );
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
