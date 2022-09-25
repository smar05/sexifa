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
}
