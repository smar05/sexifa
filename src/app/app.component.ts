import { Component } from '@angular/core';
import { functions } from './helpers/functions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'OnlyGram';

  constructor() {
    this.deshabilitarClickYSeleccionDeTexto();
  }

  /**
   * Metodo para deshabilitar el click derecho y la seleccion de texto en las imagenes
   *
   * @private
   * @memberof AppComponent
   */
  private deshabilitarClickYSeleccionDeTexto(): void {
    document.addEventListener('contextmenu', (event) => {
      event.preventDefault();
    });

    document.addEventListener('selectstart', (event) => {
      event.preventDefault();
    });

    document.addEventListener('keyup', (event) => {
      if (event.key === 'PrintScreen') {
        functions.bloquearPantalla(true);
      }
    });
  }
}
