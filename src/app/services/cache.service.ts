import { Injectable } from '@angular/core';
import { IFireStoreRes } from '../interface/ifireStoreRes';
import { QueryFn } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  // Caché en memoria para almacenar los datos
  private cache: { [key: string]: IFireStoreRes | IFireStoreRes[] } = {};

  constructor() {}

  /**
   * Obtener datos en cache
   *
   * @param {string} key
   * @param {QueryFn} qf
   * @return {*}  {(IFireStoreRes[] | IFireStoreRes)}
   * @memberof CacheService
   */
  public getCacheData(
    key: string,
    qf: QueryFn
  ): IFireStoreRes[] | IFireStoreRes {
    const cacheKey: string = this.createCacheKey(key, qf);

    if (this.cache[cacheKey]) {
      return this.cache[cacheKey] as IFireStoreRes[] | IFireStoreRes;
    }

    return null;
  }

  /**
   * Guardar datos en cache
   *
   * @param {string} key
   * @param {QueryFn} qf
   * @param {(IFireStoreRes | IFireStoreRes[])} data
   * @memberof CacheService
   */
  public saveCacheData(
    key: string,
    qf: QueryFn,
    data: IFireStoreRes | IFireStoreRes[]
  ): void {
    const cacheKey: string = this.createCacheKey(key, qf);

    this.cache[cacheKey] = data;
  }

  /**
   * Crear una clave única para la caché basada en la URL y la consulta
   *
   * @private
   * @param {string} url
   * @param {QueryFn} qf
   * @return {*}  {string}
   * @memberof CacheService
   */
  private createCacheKey(url: string, qf: QueryFn): string {
    return `${url}-${qf ? qf.toString() : 'default'}`;
  }
}
