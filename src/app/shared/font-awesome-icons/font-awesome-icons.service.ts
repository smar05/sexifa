import {
  faStar,
  faStarHalfStroke,
  faVenus,
  faMars,
} from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FontAwesomeIconsService {
  private icons: any = {
    faStar, //Estrella solida
    faStarHalfStroke, //Estrella media
    faStarRegular, //Estrella vacia
    faVenus, //Mujeres
    faMars, //Hombres
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
