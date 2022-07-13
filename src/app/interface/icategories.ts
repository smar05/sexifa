import { StateEnum } from '../enum/stateEnum';

export interface Icategories {
  id: string;
  icon: string;
  name: string;
  state: StateEnum;
  url: string;
  view: number;
}
