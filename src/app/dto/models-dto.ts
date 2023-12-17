import { IpriceModel } from '../interface/iprice-model';
import { Icategories } from './../interface/icategories';
export interface ModelsDTO {
  id?: string;
  categorie?: Icategories;
  name?: string;
  description?: string;
  mainImage?: string;
  price?: IpriceModel[];
  groupId?: string | number;
  gallery?: string[];
}
