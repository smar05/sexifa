import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FrontLogsService } from './front-logs.service';
import { EncryptionService } from './encryption.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BackService {
  private url: string = `${environment.urlServidorLocal}/api`;

  constructor(private http: HttpClient) {}

  /**
   * Probar la conexion entre el cliente y el back
   *
   * @return {*}  {Observable<any>}
   * @memberof BackService
   */
  public sendPing(): Observable<any> {
    return this.http.get(`${this.url}/ping`);
  }
}
