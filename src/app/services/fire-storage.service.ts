import { Injectable } from '@angular/core';
import { AngularFirestore, QueryFn } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { IFireStoreRes } from '../interface/ifireStoreRes';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FireStorageService {
  constructor(private firestore: AngularFirestore) {}

  /**
   * Traer datos de una coleccion
   *
   * @param {string} collection
   * @param {QueryFn} [qf=null] Filtro de la consulta
   * @return {*}  {Observable<any>}
   * @memberof FireStorageService
   */
  public getData(collection: string, qf: QueryFn = null): Observable<any> {
    if (qf == null) return this.firestore.collection(collection).get();
    return this.firestore.collection(collection, qf).get();
  }

  /**
   * Traer un documento de una coleccion
   *
   * @param {string} collection
   * @param {string} doc
   * @param {QueryFn} [qf=null] Filtro de la consulta
   * @return {*}  {Observable<any>}
   * @memberof FireStorageService
   */
  public getItem(
    collection: string,
    doc: string,
    qf: QueryFn = null
  ): Observable<any> {
    if (qf == null) return this.firestore.collection(collection).doc(doc).get();
    return this.firestore.collection(collection, qf).doc(doc).get();
  }

  /**
   * Guardar la informacion en una coleccion
   *
   * @param {string} collection
   * @param {Object} data
   * @return {*}  {Promise<any>}
   * @memberof FireStorageService
   */
  public post(collection: string, data: Object): Promise<any> {
    return this.firestore.collection(collection).add(data);
  }

  /**
   * Actualizar un documento de una coleccion
   *
   * @param {string} collection
   * @param {string} doc
   * @param {Object} data
   * @return {*}  {Promise<any>}
   * @memberof FireStorageService
   */
  public patch(collection: string, doc: string, data: Object): Promise<any> {
    return this.firestore.collection(collection).doc(doc).set(data);
  }

  /**
   * Elimina un documento de una coleccion
   *
   * @param {string} collection
   * @param {string} doc
   * @return {*}  {Promise<any>}
   * @memberof FireStorageService
   */
  public delete(collection: string, doc: string): Promise<any> {
    return this.firestore.collection(collection).doc(doc).delete();
  }

  /**
   * Metodo para obtener la respuesta con el id del documento
   *
   * @param {*} docChange
   * @param {string} object
   * @return {*}  {IFireStoreRes}
   * @memberof FireStorageService
   */
  public obtenerDataDeLaRespuesta(
    docChange: any,
    object: string
  ): IFireStoreRes {
    let documentId: any;
    let documentData: any;

    if (object == 'many') {
      documentId = docChange.id;
      documentData = docChange.data();
    } else if (object == 'one') {
      documentId = docChange.id;
      documentData = docChange.data();
    }

    let res: IFireStoreRes = {
      id: documentId,
      data: documentData,
    };

    return res;
  }

  /**
   * Map para los Pipe de los observables
   *
   * @param {string} object "many" o "one"
   * @return {*}  {*}
   * @memberof FireStorageService
   */
  public mapForPipe(object: string): any {
    if (object == 'many') {
      return map((resp: any) => {
        return resp.docs.map((r: any) => {
          return this.obtenerDataDeLaRespuesta(r, object);
        });
      });
    } else if (object == 'one') {
      return map((resp: any) => {
        return this.obtenerDataDeLaRespuesta(resp, object);
      });
    }
  }
}
