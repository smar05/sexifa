import { IpriceModel } from './iprice-model';

export interface Imodels {
  id?: string;
  categorie?: string;
  name: string;
  description?: string;
  active?: string;
  price?: IpriceModel[];
  groupId: string | number;
  gallery?: string;
  idUser?: string;
  account?: string;
  url: string;
  redes: IModelsRedes;
}

export interface IModelsRedes {
  facebook?: string;
  instagram?: string;
  x?: string;
  tiktok?: string;
  threads?: string;
}

export enum ModelsFilterEnum {
  active_categorie = 'active_categorie',
}

export enum ActiveModelEnum {
  ACTIVO = 'activo',
  INACTIVO = 'inactivo',
}

export enum ModelsAccountEnum {
  PUBLIC = 'public',
  PRIVATE = 'private',
}
