import { UrlPagesEnum } from './../enum/urlPagesEnum';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { LocalStorageEnum } from '../enum/localStorageEnum';
import { UserTypeEnum } from '../enum/userTypeEnum';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private http: HttpClient, private loginService: LoginService) {}

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
          idToken: localStorage.getItem(LocalStorageEnum.TOKEN),
        };
        this.http.post(environment.urlGetUser, body).subscribe(
          (resp: any): any => {
            // Se comprueba que el tipo de cliente pueda acceder solo a sus respectivas paginas
            let tipoCliente: string = localStorage.getItem(
              LocalStorageEnum.USER_TYPE
            );
            let pathActual: string = window.location.hash;
            let usuarioPuedeAcceder: boolean = true;

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

              case UserTypeEnum.VENDEDOR:
                usuarioPuedeAcceder =
                  pathActual.includes(UrlPagesEnum.HOME_SELLER) ||
                  pathActual.includes(UrlPagesEnum.PAGE_SELLER) ||
                  pathActual.includes(UrlPagesEnum.LOGIN) ||
                  pathActual.includes(UrlPagesEnum.FORGOT_PASSWORD) ||
                  pathActual.includes(UrlPagesEnum.REGISTER) ||
                  pathActual.includes(UrlPagesEnum.USER_SELLER);
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
