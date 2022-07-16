import { Ipages } from '../interface/ipages';
import { Icategories } from './../interface/icategories';
export interface ModelsDTO {
  id?: string;
  categorie?: Icategories;
  name?: string;
  page?: Ipages;
  url?: string;
  description?: string;
  mainImage?: string;
}
