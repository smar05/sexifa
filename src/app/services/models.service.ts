import {
  IpriceModel,
  PriceTypeLimitEnum,
  TypeOfferEnum,
} from './../interface/iprice-model';
import { environment } from './../../environments/environment';
import { CategoriesService } from './categories.service';
import { ModelsDTO } from './../dto/models-dto';
import { StorageService } from './storage.service';
import { Imodels } from './../interface/imodels';
import { Observable } from 'rxjs';
import { IQueryParams } from './../interface/i-query-params';
import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { ImgModelEnum } from '../enum/imgModelEnum';
import { FireStorageService } from './fire-storage.service';
import { QueryFn } from '@angular/fire/compat/firestore';
import { alerts } from '../helpers/alerts';
import { IFrontLogs } from '../interface/i-front-logs';
import { FrontLogsService } from './front-logs.service';
import { LocalStorageEnum } from '../enum/localStorageEnum';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ModelsService {
  private urlModels: string = environment.urlCollections.models;
  private urlImage: string = `/models`;
  private urlModelsApi: string = `${environment.urlServidorLocal}/api/${environment.urlsServidor.urlModelsApi}`;

  constructor(
    private apiService: ApiService,
    private storageService: StorageService,
    private categoriesService: CategoriesService,
    private fireStorageService: FireStorageService,
    private frontLogsService: FrontLogsService,
    private http: HttpClient
  ) {}

  /**
   * Se toma la informacion de la coleccion de modelos en Firebase
   *
   * @param {IQueryParams} [queryParams={}]
   * @return {*}  {Observable<any>}
   * @memberof ModelsService
   */
  public getData(queryParams: IQueryParams = {}): Observable<any> {
    return this.apiService.get(`${this.urlModels}.json`, queryParams);
  }

  /**
   * Tomar un item de modelos
   *
   * @param {string} id
   * @param {IQueryParams} [queryParams={}]
   * @return {*}  {Observable<any>}
   * @memberof ModelsService
   */
  public getItem(id: string, queryParams: IQueryParams = {}): Observable<any> {
    return this.apiService.get(`${this.urlModels}/${id}.json`, queryParams);
  }

  /**
   * Guardar informacion del modelo
   *
   * @param {Imodels} data
   * @return {*}  {Observable<any>}
   * @memberof ModelsService
   */
  public postData(data: Imodels): Observable<any> {
    return this.apiService.post(`${this.urlModels}.json`, data);
  }

  /**
   * Actualizar modelo
   *
   * @param {string} id
   * @param {object} data
   * @return {*}  {Observable<any>}
   * @memberof ModelsService
   */
  public patchData(id: string, data: object): Observable<any> {
    return this.apiService.patch(`${this.urlModels}/${id}.json`, data);
  }

  /**
   * Eliminar modelo
   *
   * @param {string} id
   * @return {*}  {Observable<any>}
   * @memberof ModelsService
   */
  public deleteData(id: string): Observable<any> {
    return this.apiService.delete(`${this.urlModels}/${id}.json`);
  }

  //------------ FireStorage---------------//
  /**
   * Se toma la informacion de la coleccion de modelos en Firebase
   *
   * @param {QueryFn} [qf=null]
   * @return {*}  {Observable<any>}
   * @memberof ModelsService
   */
  public getDataFS(qf: QueryFn = null): Observable<any> {
    return this.fireStorageService
      .getData(this.urlModels, qf)
      .pipe(this.fireStorageService.mapForPipe('many'));
  }

  /**
   * Tomar un documento de modelos
   *
   * @param {string} doc
   * @param {QueryFn} [qf=null]
   * @return {*}  {Observable<any>}
   * @memberof ModelsService
   */
  public getItemFS(doc: string, qf: QueryFn = null): Observable<any> {
    return this.fireStorageService
      .getItem(this.urlModels, doc, qf)
      .pipe(this.fireStorageService.mapForPipe('one'));
  }

  /**
   * Guardar informacion del modelo
   *
   * @param {Imodels} data
   * @return {*}  {Promise<any>}
   * @memberof ModelsService
   */
  public postDataFS(data: Imodels): Promise<any> {
    return this.fireStorageService.post(this.urlModels, data);
  }

  /**
   * Actualizar modelo
   *
   * @param {string} doc
   * @param {Imodels} data
   * @return {*}  {Promise<any>}
   * @memberof ModelsService
   */
  public patchDataFS(doc: string, data: Imodels): Promise<any> {
    return this.fireStorageService.patch(this.urlModels, doc, data);
  }

  /**
   * Eliminar modelo
   *
   * @param {string} doc
   * @return {*}  {Promise<any>}
   * @memberof ModelsService
   */
  public deleteDataFS(doc: string): Promise<any> {
    return this.fireStorageService.delete(this.urlModels, doc);
  }

  //------------ FireStorage---------------//

  //-------- Funciones comunes ---------//
  /**
   * Retorna la url para el router link
   *
   * @param {(ModelsDTO | Imodels)} model
   * @return {*}  {string}
   * @memberof ModelsService
   */
  public getRouterLinkUrl(model: ModelsDTO | Imodels): string {
    //let modelArray: string[] | undefined = model.name?.split(' ');
    return `${model.id}`;
  }

  //-------- Storage -----//

  /**
   *  Se obtiene la imagen principal del modelo
   *
   * @param {Imodels} model
   * @return {*}  {Promise<any>}
   * @memberof ModelsService
   */
  public getMainImage(model: Imodels): Promise<any> {
    let url: string = `${this.urlModels}/${model.id}/main`;
    return this.storageService.getStorageListAll(url);
  }

  /**
   *
   *
   * @param {string} url
   * @return {*}  {Promise<string>}
   * @memberof ModelsService
   */
  public async getImage(url: string): Promise<string> {
    let image: any = null;

    try {
      image = (
        await this.storageService.getStorageListAll(`${this.urlImage}/${url}`)
      ).items[0];
    } catch (error) {
      console.error('Error: ', error);
      alerts.basicAlert(
        'Error',
        'Ha ocurrido un error en la obtencion de la imagen',
        'error'
      );

      let data: IFrontLogs = {
        date: new Date(),
        userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
        log: `file: models.service.ts: ~ ModelsService ~ getImage ~ JSON.stringify(error): ${JSON.stringify(
          error
        )}`,
      };

      this.frontLogsService
        .postDataFS(data)
        .then((res) => {})
        .catch((err) => {
          alerts.basicAlert('Error', 'Error', 'error');
        });
    }

    if (image) {
      return this.storageService.getDownloadURL(image);
    }

    return '';
  }

  /**
   *
   *
   * @param {string} url
   * @return {*}  {Promise<string[]>}
   * @memberof ProductsService
   */
  public async getImages(url: string): Promise<string[]> {
    let images: any[] = null;

    try {
      images = (
        await this.storageService.getStorageListAll(`${this.urlImage}/${url}`)
      ).items;
    } catch (error) {
      console.error('Error: ', error);
      alerts.basicAlert(
        'Error',
        'Ha ocurrido un error en la obtencion de imagenes',
        'error'
      );

      let data: IFrontLogs = {
        date: new Date(),
        userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
        log: `file: models.service.ts: ~ ModelsService ~ getImages ~ JSON.stringify(error): ${JSON.stringify(
          error
        )}`,
      };

      this.frontLogsService
        .postDataFS(data)
        .then((res) => {})
        .catch((err) => {
          alerts.basicAlert('Error', 'Error', 'error');
        });
    }

    if (images) {
      let imagesUrl: string[] = [];
      for (const image of images) {
        let url: string = null;
        try {
          url = await this.storageService.getDownloadURL(image);
        } catch (error) {
          console.error('Error: ', error);
          alerts.basicAlert(
            'Error',
            'Ha ocurrido un error en la obtencion de la imagen',
            'error'
          );

          let data: IFrontLogs = {
            date: new Date(),
            userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
            log: `file: models.service.ts: ~ ModelsService ~ getImages ~ JSON.stringify(error): ${JSON.stringify(
              error
            )}`,
          };

          this.frontLogsService
            .postDataFS(data)
            .then((res) => {})
            .catch((err) => {
              alerts.basicAlert('Error', 'Error', 'error');
            });
        }
        imagesUrl.push();
      }
      return imagesUrl;
    }

    return [];
  }

  /**
   * Eliminar las imagenes del producto
   *
   * @param {string} url
   * @return {*}  {Promise<boolean>}
   * @memberof ModelsService
   */
  public async deleteImages(url: string): Promise<boolean> {
    let complete: boolean = true;
    try {
      let images: any[] = null;

      try {
        images = (
          await this.storageService.getStorageListAll(`${this.urlImage}/${url}`)
        ).items;
      } catch (error) {
        console.error('Error: ', error);
        alerts.basicAlert(
          'Error',
          'Ha ocurrido un error en la obtencion de las imagenes',
          'error'
        );

        let data: IFrontLogs = {
          date: new Date(),
          userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
          log: `file: models.service.ts: ~ ModelsService ~ deleteImages ~ JSON.stringify(error): ${JSON.stringify(
            error
          )}`,
        };

        this.frontLogsService
          .postDataFS(data)
          .then((res) => {})
          .catch((err) => {
            alerts.basicAlert('Error', 'Error', 'error');
          });
      }

      if (images && images.length > 0) {
        for (const image of images) {
          if (image._location.path) {
            try {
              await this.storageService.deleteImage(image._location.path);
            } catch (error) {
              console.error('Error: ', error);
              alerts.basicAlert(
                'Error',
                'Ha ocurrido un error eliminando la imagen',
                'error'
              );

              let data: IFrontLogs = {
                date: new Date(),
                userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
                log: `file: models.service.ts: ~ ModelsService ~ deleteImages ~ JSON.stringify(error): ${JSON.stringify(
                  error
                )}`,
              };

              this.frontLogsService
                .postDataFS(data)
                .then((res) => {})
                .catch((err) => {
                  alerts.basicAlert('Error', 'Error', 'error');
                });
            }
          } else {
            continue;
          }
        }
      }
    } catch (error) {
      console.error('Error: ', error);
      complete = false;

      let data: IFrontLogs = {
        date: new Date(),
        userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
        log: `file: models.service.ts: ~ ModelsService ~ deleteImages ~ JSON.stringify(error): ${JSON.stringify(
          error
        )}`,
      };

      this.frontLogsService
        .postDataFS(data)
        .then((res) => {})
        .catch((err) => {
          alerts.basicAlert('Error', 'Error', 'error');
        });
    }

    return complete;
  }

  /**
   * Guardar la imagen
   *
   * @param {File} file
   * @param {string} name
   * @return {*}  {Promise<any>}
   * @memberof ModelsService
   */
  public async saveImage(file: File, name: string): Promise<any> {
    let url: string = `${this.urlImage}/${name}`;
    let guardarImagen: any = null;

    try {
      guardarImagen = await this.storageService.saveImage(file, url);
    } catch (error) {
      console.error('Error: ', error);
      alerts.basicAlert(
        'Error',
        'Ha ocurrido un error guardando la imagen',
        'error'
      );

      let data: IFrontLogs = {
        date: new Date(),
        userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
        log: `file: models.service.ts: ~ ModelsService ~ saveImage ~ JSON.stringify(error): ${JSON.stringify(
          error
        )}`,
      };

      this.frontLogsService
        .postDataFS(data)
        .then((res) => {})
        .catch((err) => {
          alerts.basicAlert('Error', 'Error', 'error');
        });
    }

    return guardarImagen;
  }

  //-------- DTO functions ------------//

  /**
   * Interfaz de modelo a DTO
   *
   * @param {Imodels} imodel
   * @return {*}  {Promise<ModelsDTO>}
   * @memberof ModelsService
   */
  public async modelInterfaceToDTO(imodel: Imodels): Promise<ModelsDTO> {
    let modelDTO: ModelsDTO = {};

    //Parametros basicos
    modelDTO.id = imodel.id;
    modelDTO.description = imodel.description;
    modelDTO.name = imodel.name;
    modelDTO.price = imodel.price;
    modelDTO.groupId = imodel.groupId;
    modelDTO.gallery = [];

    if (imodel.gallery)
      JSON.parse(imodel.gallery).forEach(async (galleryItem: string) => {
        let urlImage: string = null;

        try {
          urlImage = await this.getImage(
            `${imodel.id}/${ImgModelEnum.GALLERY}/${galleryItem}`
          );
        } catch (error) {
          console.error('Error: ', error);
          alerts.basicAlert(
            'Error',
            'Ha ocurrido un error obteniendo la galeria',
            'error'
          );

          let data: IFrontLogs = {
            date: new Date(),
            userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
            log: `file: models.service.ts: ~ ModelsService ~ JSON.stringify(error): ${JSON.stringify(
              error
            )}`,
          };

          this.frontLogsService
            .postDataFS(data)
            .then((res) => {})
            .catch((err) => {
              alerts.basicAlert('Error', 'Error', 'error');
            });
        }

        modelDTO.gallery?.push(urlImage);
      });

    //Imagen principal
    try {
      modelDTO.mainImage = await this.getImage(
        `${imodel.id}/${ImgModelEnum.MAIN}`
      );
    } catch (error) {
      console.error('Error: ', error);
      alerts.basicAlert(
        'Error',
        'Ha ocurrido un error obteniendo la imagen principal',
        'error'
      );

      let data: IFrontLogs = {
        date: new Date(),
        userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
        log: `file: models.service.ts: ~ ModelsService ~ modelInterfaceToDTO ~ JSON.stringify(error): ${JSON.stringify(
          error
        )}`,
      };

      this.frontLogsService
        .postDataFS(data)
        .then((res) => {})
        .catch((err) => {
          alerts.basicAlert('Error', 'Error', 'error');
        });
    }
    //Categoria
    try {
      modelDTO.categorie = await this.categoriesService
        .getItem(imodel.categorie || '')
        .toPromise();
    } catch (error) {
      console.error('Error: ', error);
      alerts.basicAlert(
        'Error',
        'Ha ocurrido un error obteniendo la categoria',
        'error'
      );

      let data: IFrontLogs = {
        date: new Date(),
        userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
        log: `file: models.service.ts: ~ ModelsService ~ modelInterfaceToDTO ~ JSON.stringify(error): ${JSON.stringify(
          error
        )}`,
      };

      this.frontLogsService
        .postDataFS(data)
        .then((res) => {})
        .catch((err) => {
          alerts.basicAlert('Error', 'Error', 'error');
        });
    }

    return modelDTO;
  }

  /**
   * Calcular los precios
   *
   * @param {*} params Se pasa el precio y la fecha de compra
   * @return {*}  {Observable<any>}
   * @memberof ModelsService
   */
  public calcularPrecioSubscripcion(params: any): Observable<any> {
    return this.http.get(`${this.urlModelsApi}/obtener-precios`, { params });
  }
}
