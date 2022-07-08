import {
  faMars,
  faVenus,
  faTransgender,
} from '@fortawesome/free-solid-svg-icons';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FontAwesomeIconsService {
  private icons: any = {
    faMars, //Simbolo masculino
    faVenus, //Simbolo femenino
    faTransgender, //Simbolo de transgeneros
  };

  constructor() {}

  /**
   * Devuelve el objeto del icono que encuentra por el nombre
   *
   * @param {string} iconName
   * @return {*}  {*}
   * @memberof FontAwesomeIcons
   */
  public getIcon(iconName: string): any {
    return this.icons[iconName];
  }
}
