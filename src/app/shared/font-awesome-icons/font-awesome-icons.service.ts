import { faStar, faStarHalfStroke } from '@fortawesome/free-solid-svg-icons';
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
