import { IInfoModelSubscription } from './i-info-model-subscription';
import { Imodels } from './imodels';
export interface ICart {
  model?: Imodels;
  infoModelSubscription?: IInfoModelSubscription;
  detalle?: string;
  price?: number;
}
