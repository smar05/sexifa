import { PagesService } from './pages.service';
import { Icategories } from './../interface/icategories';
import { CategoriesService } from './categories.service';
import { ModelsDTO } from './../dto/models-dto';
import { StorageService } from './storage.service';
import { Imodels } from './../interface/imodels';
import { Observable } from 'rxjs';
import { IQueryParams } from './../interface/i-query-params';
import { ApiService } from './api.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModelsService {
  private urlModels: string = 'models';

  constructor(
    private apiService: ApiService,
    private storageService: StorageService,
    private categoriesService: CategoriesService,
    private pagesService: PagesService
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

  //-------- Funciones comunes ---------//
  /**
   * Retorna la url para el router link
   *
   * @param {(ModelsDTO | Imodels)} model
   * @return {*}  {string}
   * @memberof ModelsService
   */
  public getRouterLinkUrl(model: ModelsDTO | Imodels): string {
    let modelArray: string[] | undefined = model.name?.split(' ');
    return `${modelArray?.join('-')}_${model.id}`;
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
    modelDTO.url = imodel.url;

    //Imagen principal
    let image: any = (await this.getMainImage(imodel)).items[0];
    modelDTO.mainImage = await this.storageService.getDownloadURL(image);

    //Categoria
    modelDTO.categorie = await this.categoriesService
      .getItem(imodel.categorie || '')
      .toPromise();

    //Pages
    modelDTO.page = await this.pagesService
      .getItem(imodel.page || '')
      .toPromise();

    return modelDTO;
  }
}
