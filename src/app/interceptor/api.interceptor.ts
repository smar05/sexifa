import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocalStorageEnum } from '../enum/localStorageEnum';
import { EnumEndpointsBack } from '../enum/enum-endpoints-back';
import { UrlPagesEnum } from '../enum/urlPagesEnum';
import { Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { EncryptionService } from '../services/encryption.service';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  private token: string = '';

  constructor(
    private router: Router,
    private tokenService: TokenService,
    private encryptionService: EncryptionService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    //Que nose agregen token a las peticiones de login
    //ni de refrescar token
    let urlActual: string = this.router.url;

    if (
      request.url == environment.urlLogin ||
      request.url == environment.urlRefreshToken ||
      (request.url.includes(environment.urlCollections.users) &&
        request.method == 'POST') || //Para registrar un nuevo usuario
      request.url.includes(environment.urlLocation) ||
      request.url.includes(environment.apiKeyCurrencyConverter) ||
      (request.url.includes(EnumEndpointsBack.TELEGRAM.COMUNICAR_BOT_CLIENTE) &&
        urlActual.includes(UrlPagesEnum.REGISTER))
    )
      return next.handle(request);
    this.token = localStorage.getItem(LocalStorageEnum.TOKEN);
    //Se captura la fecha de expiracion en
    //formato epoch
    const payload: any = JSON.parse(atob(this.token.split('.')[1])).exp;
    //De epoch a formato tradicional de fecha
    const tokenExp: any = new Date(payload * 1000);
    //Tiempo actual
    const now: any = new Date();
    //Calcular 15 min despues del tiempo actual
    now.setTime(now.getTime() + 15 * 60 * 1000);
    if (tokenExp.getTime() < now.getTime()) {
      this.tokenService.actualizarToken(
        localStorage.getItem(LocalStorageEnum.REFRESH_TOKEN)
      );
    }

    return next.handle(this.cloneToken(request, this.token)).pipe(
      map((resp: any) => {
        return resp;
      })
    );
  }

  //Clonar el parametro token
  private cloneToken(
    request: HttpRequest<unknown>,
    token: string
  ): HttpRequest<any> {
    let dateEncrypted: string = this.encryptionService.encryptData(
      new Date().toISOString()
    );
    return request.clone({
      setParams: {
        auth: token,
        date: dateEncrypted,
      },
    });
  }
}
