import { UrlPagesEnum } from './../enum/urlPagesEnum';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { LocalStorageEnum } from '../enum/localStorageEnum';
import { UserTypeEnum } from '../enum/userTypeEnum';
import { LoginService } from '../services/login.service';
import { UserService } from '../services/user.service';
import { QueryFn } from '@angular/fire/compat/firestore';
import { IFireStoreRes } from '../interface/ifireStoreRes';
import { Iuser } from '../interface/iuser';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(
    private http: HttpClient,
    private loginService: LoginService,
    private userService: UserService
  ) {}

  canActivate(): Promise<boolean> {
    return new Promise((resolve) => {
      // Se guarda la url para redirigir si no se ha logueado el usuario
      let pathActual: string = window.location.hash;
      let token: string = localStorage.getItem(LocalStorageEnum.TOKEN);

      if (pathActual.includes(UrlPagesEnum.GROUP) && !token) {
        localStorage.setItem(
          LocalStorageEnum.REDIRECT_TO,
          pathActual.split('#')[1]
        );
      }

      //Validamos que exista el token
      if (token) {
        //Validamos que el token sea real
        let body: any = {
          idToken: token,
        };
        this.http.post(environment.urlGetUser, body).subscribe(
          async (resp: any): Promise<any> => {
            // Se comprueba que el tipo de cliente pueda acceder solo a sus respectivas paginas
            let tipoCliente: string = localStorage.getItem(
              LocalStorageEnum.USER_TYPE
            );
            let pathActual: string = window.location.hash;
            let usuarioPuedeAcceder: boolean = true;

            let qf: QueryFn = (ref) =>
              ref.where(
                'id',
                '==',
                localStorage.getItem(LocalStorageEnum.LOCAL_ID)
              );

            let res: IFireStoreRes[] = null;
            try {
              res = await this.userService.getDataFS(qf).toPromise();
            } catch (error) {}

            if (!res || res.length == 0) {
              resolve(false);
              return;
            }

            let user: Iuser = { ...res[0].data };

            if (user.type !== tipoCliente) {
              resolve(false);
              return;
            }

            switch (tipoCliente) {
              case UserTypeEnum.USUARIO:
                usuarioPuedeAcceder =
                  pathActual == `#/${UrlPagesEnum.HOME}` ||
                  pathActual.includes(UrlPagesEnum.GROUP) ||
                  pathActual.includes(UrlPagesEnum.USER) ||
                  pathActual.includes(UrlPagesEnum.LOGIN) ||
                  pathActual.includes(UrlPagesEnum.FORGOT_PASSWORD) ||
                  pathActual.includes(UrlPagesEnum.REGISTER) ||
                  pathActual.includes(UrlPagesEnum.CHECKOUT);
                break;

              case UserTypeEnum.CREADOR:
                usuarioPuedeAcceder =
                  pathActual.includes(UrlPagesEnum.HOME_SELLER) ||
                  pathActual.includes(UrlPagesEnum.PAGE_SELLER) ||
                  pathActual.includes(UrlPagesEnum.LOGIN) ||
                  pathActual.includes(UrlPagesEnum.FORGOT_PASSWORD) ||
                  pathActual.includes(UrlPagesEnum.REGISTER) ||
                  pathActual.includes(UrlPagesEnum.CREATOR);
                break;

              default:
                usuarioPuedeAcceder = false;
                break;
            }

            if (usuarioPuedeAcceder) {
              resolve(true);
            } else {
              this.loginService.logout();
              resolve(false);
            }
          },
          (err: any): any => {
            this.loginService.logout();
            resolve(false);
          }
        );
      } else {
        let auxRedirectTo: string = localStorage.getItem(
          LocalStorageEnum.REDIRECT_TO
        );
        this.loginService.logout();
        if (auxRedirectTo)
          localStorage.setItem(LocalStorageEnum.REDIRECT_TO, auxRedirectTo);
        resolve(false);
      }
    });
  }
}
