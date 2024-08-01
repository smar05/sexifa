import { SweetAlertIcon } from 'sweetalert2';

export interface IAlertsPages {
  id: string;
  active: boolean;
  icon: SweetAlertIcon;
  text: string;
  title: string;
  idApplication: EnumAlertsPagesIdApplication;
  page: string;
  show: EnumAlertsPagesShow;
}

export enum EnumAlertsPagesIdApplication {
  USER_APP = 'user_app',
}

export enum EnumAlertsPagesShow {
  ALWAYS = 'always',
  ONE_TIME = 'one_time',
}
