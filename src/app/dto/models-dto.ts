import { IpriceModel } from '../interface/iprice-model';

export interface ModelsDTO {
  id?: string;
  categorie?: string;
  name?: string;
  description?: string;
  mainImage?: string;
  price?: IpriceModel[];
  groupId?: string | number;
  gallery?: string[];
}
