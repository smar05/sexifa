import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private http: HttpClient) {}

  canActivate(): Promise<boolean> {
    return new Promise((resolve) => {
      //Validamos que exista el token
      if (localStorage.getItem('token') != null) {
        //Validamos que el token sea real
        let body: any = {
          idToken: localStorage.getItem('token'),
        };
        this.http.post(environment.urlGetUser, body).subscribe(
          (resp: any): any => {
            resolve(true);
          },
          (err: any): any => {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
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
