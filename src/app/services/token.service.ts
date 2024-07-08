import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageEnum } from '../enum/localStorageEnum';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor(private http: HttpClient) {}

  /**
   * Actualizar el token
   *
   * @param {string} refresh_token
   * @memberof TokenService
   */
  public actualizarToken(refresh_token: string): void {
    const body = {
      grant_type: 'refresh_token',
      refresh_token,
    };
    this.http.post(environment.urlRefreshToken, body).subscribe((resp: any) => {
      //Se captura el idToken y refreshToken
      localStorage.setItem(LocalStorageEnum.TOKEN, resp.id_token);
      localStorage.setItem(LocalStorageEnum.REFRESH_TOKEN, resp.refresh_token);
    });
  }
}
