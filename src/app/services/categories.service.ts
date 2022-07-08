import { Icategories } from './../interface/icategories';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private urlApi: string = environment.urlFirebase;

  constructor(private http: HttpClient) {}

  /**
   * Se toma la informacion de la coleccion de Categorias en Firebase
   *
   * @return {*}  {Observable<any>}
   * @memberof CategoriesService
   */
  public getData(): Observable<any> {
    return this.http.get(`${this.urlApi}categories.json`);
  }

  /**
   * Data filtrada de categorias
   *
   * @param {string} orderBy
   * @param {string} equalTo
   * @return {*}  {Observable<any>}
   * @memberof CategoriesService
   */
  public getFilterData(orderBy: string, equalTo: string): Observable<any> {
    return this.http.get(
      `${this.urlApi}categories.json?orderBy="${orderBy}"&equalTo="${equalTo}"&print=pretty`
    );
  }

  /**
   * TOmar un item de categorias
   *
   * @param {string} id
   * @return {*}  {Observable<any>}
   * @memberof CategoriesService
   */
  public getItem(id: string): Observable<any> {
    return this.http.get(`${this.urlApi}categories/${id}.json`);
  }

  /**
   * Guardar informacion de la categoria
   *
   * @param {Icategories} data
   * @return {*}  {Observable<any>}
   * @memberof CategoriesService
   */
  public postData(data: Icategories): Observable<any> {
    return this.http.post(`${this.urlApi}categories.json`, data);
  }

  /**
   * Actualizar categoria
   *
   * @param {string} id
   * @param {object} data
   * @return {*}  {Observable<any>}
   * @memberof CategoriesService
   */
  public patchData(id: string, data: object): Observable<any> {
    return this.http.patch(`${this.urlApi}categories/${id}.json`, data);
  }

  /**
   * Eliminar categoria
   *
   * @param {string} id
   * @return {*}  {Observable<any>}
   * @memberof CategoriesService
   */
  public deleteData(id: string): Observable<any> {
    return this.http.delete(`${this.urlApi}categories/${id}.json`);
  }
}
