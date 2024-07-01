import Swal, { SweetAlertIcon } from 'sweetalert2';

export class alerts {
  /**
   *Funcion de alertas basicas
   *
   * @static
   * @param {string} title
   * @param {string} text
   * @param {SweetAlertIcon} icon
   * @memberof alerts
   */
  static basicAlert(title: string, text: string, icon: SweetAlertIcon) {
    Swal.fire(title, text, icon);
  }

  /**
   *Funcion para alerta de confirmacion
   *
   * @static
   * @param {string} title
   * @param {string} text
   * @param {SweetAlertIcon} icon
   * @param {string} confirmButtonText
   * @return {*}  {Promise<any>}
   * @memberof alerts
   */
  static confirmAlert(
    title: string,
    text: string,
    icon: SweetAlertIcon,
    confirmButtonText: string
  ): Promise<any> {
    return Swal.fire({
      title: title,
      text: text,
      icon: icon,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: confirmButtonText,
    });
  }

  /**
   *
   *
   * @static
   * @param {string} title
   * @param {SweetAlertIcon} icon
   * @param {string} html
   * @return {*}  {Promise<any>}
   * @memberof alerts
   */
  static html(title: string, icon: SweetAlertIcon, html: string): Promise<any> {
    return Swal.fire({
      title: title,
      icon: 'info',
      html: html,
      showConfirmButton: false,
      showCancelButton: true,
      cancelButtonColor: '#d33',
      allowOutsideClick: false,
    });
  }
}
