import { IpriceModel } from './iprice-model';

export interface Imodels {
  id: string;
  categorie?: string;
  name: string;
  page?: string;
  url?: string;
  description?: string;
  active?: boolean;
  price?: IpriceModel[];
  filter?: any;
}

export enum ModelsFilterEnum {
  active_categorie = 'active_categorie',
}
