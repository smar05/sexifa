import {
  Storage,
  ref,
  listAll,
  getDownloadURL,
  deleteObject,
  uploadBytes,
} from '@angular/fire/storage';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(private storage: Storage) {}

  /**
   *
   *
   * @param {string} url
   * @return {*}  {Promise<any>}
   * @memberof StorageService
   */
  public getStorageListAll(url: string): Promise<any> {
    const imgRef = ref(this.storage, url);
    return listAll(imgRef);
  }

  /**
   * Obtiene la url de descarga de la imagen
   *
   * @param {*} image
   * @return {*}  {Promise<string>}
   * @memberof StorageService
   */
  public getDownloadURL(image: any): Promise<string> {
    return getDownloadURL(image);
  }

  /**
   * Borrar imagen
   *
   * @param {string} url
   * @return {*}  {Promise<void>}
   * @memberof StorageService
   */
  public deleteImage(url: string): Promise<void> {
    const imgRef = ref(this.storage, url);

    return deleteObject(imgRef);
  }

  /**
   *  Guardar una imagen
   *
   * @param {File} file
   * @param {string} url
   * @return {*}  {Promise<any>}
   * @memberof StorageService
   */
  public saveImage(file: File, url: string): Promise<any> {
    const imgRef = ref(this.storage, url);

    return uploadBytes(imgRef, file);
  }
}
