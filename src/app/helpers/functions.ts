import { ngxCsv } from 'ngx-csv';
import { alerts } from './alerts';
import { FormGroup } from '@angular/forms';
import * as watermark from 'watermarkjs';
import { QueryFn } from '@angular/fire/compat/firestore';

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

  /**
   * Transforma un objeto Json a un objeto iterable ej: {"abcd":{"nombre":"a"}} -> [{"nombre":"a"}]
   *
   * @static
   * @param {*} data
   * @return {*}  {any[]}
   * @memberof functions
   */
  static jsonToObject(data: any): any[] {
    return Object.keys(data).map((a: string) => {
      return data[a];
    });
  }

  /**
   * Elimina los valores repetidos del array
   *
   * @static
   * @param {*} array
   * @return {*}  {*}
   * @memberof functions
   */
  static eliminarDatosRepetidos(array: any): any {
    const dataArr = new Set(array);

    return [...dataArr];
  }

  /**
   * En mayuscula la primera letra de cada palabra del texto
   *
   * @static
   * @param {string} text
   * @return {*}  {string}
   * @memberof functions
   */
  static capitalizeFirstLetters(text: string): string {
    return text
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Incrementar la fecha x cantidad de meses
   *
   * @static
   * @param {Date} fecha
   * @param {number} meses
   * @return {*}  {Date}
   * @memberof functions
   */
  static incrementarMeses(fecha: Date, meses: number): Date {
    // Clonamos la fecha original para evitar modificarla directamente
    const fechaClonada = new Date(fecha);

    // Obtenemos el mes actual y lo incrementamos según la cantidad de meses
    const mesActual = fechaClonada.getMonth();
    fechaClonada.setMonth(mesActual + meses);

    return fechaClonada;
  }

  /**
   * Bloquear o desbloquear la pantalla
   *
   * @static
   * @param {boolean} bloquear
   * @memberof functions
   */
  static bloquearPantalla(bloquear: boolean): void {
    let divBloquear: HTMLElement = document.querySelector('#bloquear');
    let divApp: HTMLElement = document.querySelector('#app');

    divBloquear.style.display = bloquear ? 'flex' : 'none';
    divApp.style.display = bloquear ? 'none' : 'grid';
  }

  /**
   * Obtener un archivo CSV
   *
   * @static
   * @param {{[key:string]:any}} data
   * @param {string} filename
   * @param {{[key:string]:any}} options
   * @return {*}  {ngxCsv}
   * @memberof functions
   */
  static getCsv(
    data: { [key: string]: any },
    filename: string,
    options: { [key: string]: any }
  ): ngxCsv {
    return new ngxCsv(data, filename, options);
  }

  /**
   * Colocar marca de agua a una imagen
   *
   * @static
   * @param {string} imageUrl
   * @param {string} text
   * @param {{ color: string; opacity: number }} style
   * @return {*}  {Promise<string>}
   * @memberof functions
   */
  static addWatermark(
    imageUrl: string,
    text: string,
    style: { color: string; opacity: number }
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = imageUrl;
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (ctx) {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          // Establecer el estilo de la marca de agua
          const fontSize: number = Math.max(16, canvas.width / 30);
          ctx.font = `${fontSize}px Arial`;
          ctx.fillStyle = style.color;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          // Calcular las coordenadas del centro
          const x = canvas.width / 2;
          const y = canvas.height / 2;

          // Agregar la marca de agua en el centro
          ctx.fillText(text, x, y);

          resolve(canvas.toDataURL());
        } else {
          reject(null);
        }
      };
      img.onerror = (error) => {
        console.error('Error loading image:', error);
        reject(null);
      };
    });
  }

  /**
   * Crear una clave única para la caché basada en la URL y la consulta
   *
   * @static
   * @param {string} url
   * @param {QueryFn} qf
   * @return {*}  {string}
   * @memberof functions
   */
  static createCacheKey(url: string, qf: QueryFn): string {
    return `${url}-${qf ? qf.toString() : 'default'}`;
  }
}
