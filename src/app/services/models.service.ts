import { environment } from './../../environments/environment';
import { ModelsDTO } from './../dto/models-dto';
import { StorageService } from './storage.service';
import { Imodels } from './../interface/imodels';
import { from, Observable, of, switchMap, tap } from 'rxjs';
import { Injectable } from '@angular/core';
import { ImgModelEnum } from '../enum/imgModelEnum';
import { FireStorageService } from './fire-storage.service';
import { QueryFn } from '@angular/fire/compat/firestore';
import { FrontLogsService } from './front-logs.service';
import { HttpClient } from '@angular/common/http';
import { EnumEndpointsBack } from '../enum/enum-endpoints-back';
import { functions } from '../helpers/functions';
import { UrlPagesEnum } from '../enum/urlPagesEnum';
import { IFireStoreRes } from '../interface/ifireStoreRes';
import { CacheService } from './cache.service';
import { StorageReference } from '@angular/fire/storage';
import { EncryptionService } from './encryption.service';

@Injectable({
  providedIn: 'root',
})
export class ModelsService {
  private urlModels: string = environment.urlCollections.models;
  private urlImage: string = `/models`;
  private urlModelsApi: string = `${environment.urlServidorLocal}/api/${environment.urlsServidor.urlModelsApi}`;

  constructor(
    private storageService: StorageService,
    private fireStorageService: FireStorageService,
    private frontLogsService: FrontLogsService,
    private http: HttpClient,
    private cacheService: CacheService,
    private encryptionService: EncryptionService
  ) {}

  //------------ FireStorage---------------//
  /**
   * Se toma la informacion de la coleccion de modelos en Firebase
   *
   * @param {QueryFn} [qf=null]
   * @param {boolean} [useCache=true]
   * @return {*}  {Observable<IFireStoreRes[]>}
   * @memberof ModelsService
   */
  public getDataFS(
    qf: QueryFn = null,
    useCache: boolean = true
  ): Observable<IFireStoreRes[]> {
    if (useCache) {
      let cacheData: IFireStoreRes[] =
        (this.cacheService.getCacheData(
          this.urlModels,
          qf
        ) as IFireStoreRes[]) || null;

      if (cacheData) {
        return of(cacheData);
      }
    }

    return this.fireStorageService.getData(this.urlModels, qf).pipe(
      this.fireStorageService.mapForPipe('many'),
      tap((data: IFireStoreRes[]) =>
        this.cacheService.saveCacheData(this.urlModels, qf, data)
      )
    );
  }

  /**
   * Tomar un documento de modelos
   *
   * @param {string} doc
   * @param {QueryFn} [qf=null]
   * @param {boolean} [useCache=true]
   * @return {*}  {Observable<IFireStoreRes>}
   * @memberof ModelsService
   */
  public getItemFS(
    doc: string,
    qf: QueryFn = null,
    useCache: boolean = true
  ): Observable<IFireStoreRes> {
    let key: string = `${this.urlModels}/${doc}`;
    if (useCache) {
      let cacheData: IFireStoreRes =
        (this.cacheService.getCacheData(key, qf) as IFireStoreRes) || null;

      if (cacheData) {
        return of(cacheData);
      }
    }

    return this.fireStorageService.getItem(this.urlModels, doc, qf).pipe(
      this.fireStorageService.mapForPipe('one'),
      tap((data: IFireStoreRes) =>
        this.cacheService.saveCacheData(key, qf, data)
      )
    );
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
    return model.url ?? model.id;
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
   * @param {string} modelUrl
   * @param {boolean} [useCache=true]
   * @return {*}  {Promise<string>}
   * @memberof ModelsService
   */
  public async getImage(
    url: string,
    modelUrl: string,
    useCache: boolean = true
  ): Promise<string> {
    let image: StorageReference = null;
    const key: string = `${this.urlImage}/${url}`;
    const urlImg: string = useCache
      ? (this.cacheService.getCacheImg(key) as string) || null
      : null;

    if (urlImg) {
      return new Promise((resolve) => {
        resolve(urlImg);
      });
    }

    try {
      image = (await this.storageService.getStorageListAll(key)).items[0];
    } catch (error) {
      this.frontLogsService.catchProcessError(
        error,
        {
          title: 'Error',
          text: 'Ha ocurrido un error en la obtencion de la imagen',
          icon: 'error',
        },
        `file: models.service.ts: ~ ModelsService ~ getImage ~ JSON.stringify(error): ${JSON.stringify(
          error
        )}`
      );
    }

    if (image) {
      return from(this.storageService.getDownloadURL(image))
        .pipe(
          switchMap(async (urlImg: string) => {
            let texto: string = `${environment.urlFirebase.split('://')[1]}/${
              UrlPagesEnum.GROUP
            }/${modelUrl}`;

            let base64: string = await functions.addWatermark(urlImg, texto, {
              color: '#87796c',
              opacity: 1,
            });
            this.cacheService.saveCacheImg(key, base64);

            return base64;
          })
        )
        .toPromise();
    }

    return '';
  }

  /**
   *
   *
   * @param {string} url
   * @return {*}  {Promise<string[]>}
   * @memberof ModelsService
   */
  public async getImages(url: string): Promise<string[]> {
    let images: any[] = null;

    try {
      images = (
        await this.storageService.getStorageListAll(`${this.urlImage}/${url}`)
      ).items;
    } catch (error) {
      this.frontLogsService.catchProcessError(
        error,
        {
          title: 'Error',
          text: 'Ha ocurrido un error en la obtencion de imagenes',
          icon: 'error',
        },
        `file: models.service.ts: ~ ModelsService ~ getImages ~ JSON.stringify(error): ${JSON.stringify(
          error
        )}`
      );
    }

    if (images) {
      let imagesUrl: string[] = [];
      for (const image of images) {
        let url: string = null;
        try {
          url = await this.storageService.getDownloadURL(image);
        } catch (error) {
          this.frontLogsService.catchProcessError(
            error,
            {
              title: 'Error',
              text: 'Ha ocurrido un error en la obtencion de la imagen',
              icon: 'error',
            },
            `file: models.service.ts: ~ ModelsService ~ getImages ~ JSON.stringify(error): ${JSON.stringify(
              error
            )}`
          );
        }
        imagesUrl.push();
        throw console.error();
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
        this.frontLogsService.catchProcessError(
          error,
          {
            title: 'Error',
            text: 'Ha ocurrido un error en la obtencion de las imagenes',
            icon: 'error',
          },
          `file: models.service.ts: ~ ModelsService ~ deleteImages ~ JSON.stringify(error): ${JSON.stringify(
            error
          )}`
        );
      }

      if (images && images.length > 0) {
        for (const image of images) {
          if (image._location.path) {
            try {
              await this.storageService.deleteImage(image._location.path);
            } catch (error) {
              this.frontLogsService.catchProcessError(
                error,
                {
                  title: 'Error',
                  text: 'Ha ocurrido un error eliminando la imagen',
                  icon: 'error',
                },
                `file: models.service.ts: ~ ModelsService ~ deleteImages ~ JSON.stringify(error): ${JSON.stringify(
                  error
                )}`
              );
            }
          } else {
            continue;
          }
        }
      }
    } catch (error) {
      complete = false;

      this.frontLogsService.catchProcessError(
        error,
        {
          title: 'Error',
          text: 'Ha ocurrido un error',
          icon: 'error',
        },
        `file: models.service.ts: ~ ModelsService ~ deleteImages ~ JSON.stringify(error): ${JSON.stringify(
          error
        )}`
      );
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
      this.frontLogsService.catchProcessError(
        error,
        {
          title: 'Error',
          text: 'Ha ocurrido un error guardando la imagen',
          icon: 'error',
        },
        `file: models.service.ts: ~ ModelsService ~ saveImage ~ JSON.stringify(error): ${JSON.stringify(
          error
        )}`
      );
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
    let modelDTO: ModelsDTO = {} as any;

    //Parametros basicos
    modelDTO.id = imodel.id;
    modelDTO.description = imodel.description;
    modelDTO.name = imodel.name;
    modelDTO.price = imodel.price;
    modelDTO.groupId = imodel.groupId;
    modelDTO.gallery = [];
    modelDTO.categorie = imodel.categorie;
    modelDTO.url = imodel.url;
    modelDTO.redes = imodel.redes;

    if (imodel.gallery)
      JSON.parse(imodel.gallery).forEach(async (galleryItem: string) => {
        let urlImage: string = null;

        try {
          urlImage = await this.getImage(
            `${imodel.id}/${ImgModelEnum.GALLERY}/${galleryItem}`,
            imodel.url
          );
        } catch (error) {
          this.frontLogsService.catchProcessError(
            error,
            {
              title: 'Error',
              text: 'Ha ocurrido un error obteniendo la galeria',
              icon: 'error',
            },
            `file: models.service.ts: ~ ModelsService ~ JSON.stringify(error): ${JSON.stringify(
              error
            )}`
          );
        }

        modelDTO.gallery?.push(urlImage);
      });

    //Imagen principal
    try {
      let imageUrl: string = await this.getImage(
        `${imodel.id}/${ImgModelEnum.MAIN}`,
        imodel.url
      );

      modelDTO.mainImage = imageUrl;
    } catch (error) {
      this.frontLogsService.catchProcessError(
        error,
        {
          title: 'Error',
          text: 'Ha ocurrido un error obteniendo la imagen principal',
          icon: 'error',
        },
        `file: models.service.ts: ~ ModelsService ~ modelInterfaceToDTO ~ JSON.stringify(error): ${JSON.stringify(
          error
        )}`
      );
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
    let paramsEncrypted: object =
      this.encryptionService.encryptDataJson(params);

    return this.http.get(
      `${this.urlModelsApi}/${EnumEndpointsBack.MODELS.OBTENER_PRECIOS}`,
      { params: paramsEncrypted as any }
    );
  }
}
