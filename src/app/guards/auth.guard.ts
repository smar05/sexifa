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
      //Validamos que exista el token
      if (localStorage.getItem(LocalStorageEnum.TOKEN) != null) {
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
            let pathActual: string = window.location.pathname;
            let usuarioPuedeAcceder: boolean = true;

            switch (tipoCliente) {
              case UserTypeEnum.CLIENTE:
                usuarioPuedeAcceder =
                  pathActual == `/${UrlPagesEnum.HOME}` ||
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
        this.loginService.logout();
        resolve(false);
      }
    });
  }
}
