import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { alerts } from 'src/app/helpers/alerts';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { QueryFn, QuerySnapshot } from '@angular/fire/compat/firestore';
import { FireStorageService } from './fire-storage.service';
import {
  EnumAlertsPagesIdApplication,
  EnumAlertsPagesShow,
  IAlertsPages,
} from '../interface/i-alerts-pages';
import { EnumPages } from '../enum/enum-pages';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root',
})
export class AlertsPagesService {
  private urlAlerts: string = environment.urlCollections.alerts;

  constructor(
    private fireStorageService: FireStorageService,
    private cacheService: CacheService
  ) {}

  /**
   * Alertas por paginas
   *
   * @param {EnumPages} page
   * @return {*}  {Observable<IAlertsPages>}
   * @memberof AlertsPagesService
   */
  public alertPage(page: EnumPages): Observable<IAlertsPages> {
    let qf: QueryFn = (qf) =>
      qf
        .where('active', '==', true)
        .where('page', '==', page)
        .where('idApplication', '==', EnumAlertsPagesIdApplication.USER_APP)
        .limit(1);

    let cacheData: IAlertsPages =
      (this.cacheService.getCacheData(
        `${this.urlAlerts}/${page}`,
        qf
      ) as any) || null;

    if (cacheData && cacheData.show === EnumAlertsPagesShow.ALWAYS) {
      return of(cacheData).pipe(
        map((res: IAlertsPages) => {
          if (res) {
            alerts.basicAlert(res.title, res.text, res.icon);
          }

          return null;
        })
      );
    } else if (cacheData && cacheData.show === EnumAlertsPagesShow.ONE_TIME) {
      return of(null);
    }

    return this.fireStorageService.getData(this.urlAlerts, qf).pipe(
      map((res: QuerySnapshot<IAlertsPages>) => {
        if (res && res.docs.length > 0) {
          let alerta: IAlertsPages = {
            id: res.docs[0].id,
            ...res.docs[0].data(),
          };

          alerts.basicAlert(alerta.title, alerta.text, alerta.icon);

          return alerta;
        }

        return null;
      }),
      tap((data: any) => {
        this.cacheService.saveCacheData(`${this.urlAlerts}/${page}`, qf, data);
      })
    );
  }
}
