import { alerts } from './alerts';
import { FormGroup } from '@angular/forms';

export class functions {
  /**
   * Validar campos del formulario
   *
   * @static
   * @param {string} field
   * @param {FormGroup} f
   * @param {boolean} formSubmitted
   * @return {*}  {boolean}
   * @memberof functions
   */
  static invalidField(
    field: string,
    f: FormGroup,
    formSubmitted: boolean
  ): boolean {
    return formSubmitted && f.controls[field].invalid;
  }

  /**
   * Funcion para determinar el tamaño de la pantalla
   *
   * @static
   * @param {number} minWidth
   * @param {number} maxWidth
   * @return {*}  {boolean}
   * @memberof functions
   */
  static screenSize(minWidth: number, maxWidth: number): boolean {
    if (
      window.matchMedia(`(min-width:${minWidth}px)and(max-width:${maxWidth}px)`)
        .matches
    ) {
      return true;
    }
    return false;
  }

  /**
   * Validar imagenes
   *
   * @static
   * @param {*} e
   * @return {*}  {*}
   * @memberof functions
   */
  static validateImage(e: any): any {
    return new Promise((resolve) => {
      const image = e.target.files[0];
      //validar el formato
      if (image['type'] !== 'image/jpeg' && image['type'] !== 'image/png') {
        alerts.basicAlert(
          'Error',
          'La imagen debe estar en formato PNG o JPG',
          'error'
        );
        return;
      }
      //validacion de tamaño
      else if (image['size'] > 2000000) {
        alerts.basicAlert(
          'Error',
          'La imagen no debe superar 2MB de peso',
          'error'
        );
        return;
      }
      //Mostrar imagen temporal
      else {
        let data = new FileReader();
        data.readAsDataURL(image);
        data.onloadend = () => {
          resolve(data.result);
        };
      }
    });
  }

  /**
   *Crear url
   *
   * @static
   * @param {string} value
   * @return {*}  {string}
   * @memberof functions
   */
  static createUrl(value: string): string {
    value = value.toLowerCase();
    value = value.replace(/[ ]/g, '-');
    value = value.replace(/[á]/g, 'a');
    value = value.replace(/[é]/g, 'e');
    value = value.replace(/[í]/g, 'i');
    value = value.replace(/[ó]/g, 'o');
    value = value.replace(/[ú]/g, 'u');
    value = value.replace(/[Á]/g, 'A');
    value = value.replace(/[É]/g, 'E');
    value = value.replace(/[Í]/g, 'I');
    value = value.replace(/[Ó]/g, 'O');
    value = value.replace(/[Ú]/g, 'U');
    value = value.replace(/[ñ]/g, 'n');
    value = value.replace(/[,]/g, '');
    return value;
  }

  /**
   *Convertir File a base 64
   *
   * @static
   * @param {File} file
   * @return {*}  {Promise<string>}
   * @memberof functions
   */
  static fileToBase64(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () =>
        resolve(reader.result != null ? reader.result.toString() : '');
      reader.onerror = (error) => reject(error);
    });
  }

  /**
   * Ordenar un array de la A a la Z
   *
   * @static
   * @param {any[]} array Array a ordenar
   * @param {string} orderBy Parametro por el cual ordenar
   * @return {*}  {any[]}
   * @memberof functions
   */
  static orderArrayAZ(array: any[], orderBy: string): any[] {
    return array.sort((a: any, b: any) => {
      if (a[orderBy] > b[orderBy]) {
        return 1;
      }
      if (a[orderBy] < b[orderBy]) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });
  }

  /**
   * Convertir un json a queryparams
   *
   * @static
   * @param {*} ob
   * @return {*}  {string}
   * @memberof functions
   */
  static jsonToQueryParams(ob: any): string {
    let urlParameters: string = Object.entries(ob)
      .map((e: any[]) => {
        if (typeof e[1] == 'string') {
          e[1] = '"' + e[1] + '"';
        }

        return e.join('=');
      })
      .join('&');
    return urlParameters;
  }
}
