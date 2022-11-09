import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LocalStorageEnum } from '../enum/localStorageEnum';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private http: HttpClient) {}

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
            resolve(true);
          },
          (err: any): any => {
            localStorage.removeItem(LocalStorageEnum.TOKEN);
            localStorage.removeItem(LocalStorageEnum.REFRESH_TOKEN);
            this.router.navigateByUrl('/login');
            resolve(false);
          }
        );
      } else {
        this.router.navigateByUrl('/login');
        resolve(false);
      }
    });
  }
}
