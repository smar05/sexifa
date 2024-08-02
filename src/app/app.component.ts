import { Component, OnInit } from '@angular/core';
import { functions } from './helpers/functions';
import { AlertsPagesService } from './services/alerts-page.service';
import { EnumPages } from './enum/enum-pages';
import {
  BusinessParamsService,
  EnumBusinessParamsKeys,
} from './services/business-params.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'OnlyGram';

  constructor(
    private alertsPagesService: AlertsPagesService,
    private bussinnerService: BusinessParamsService
  ) {
    this.deshabilitarClickYSeleccionDeTexto();
  }

  public async ngOnInit(): Promise<void> {
    document.body.style.removeProperty('min-height');
    await this.getVersion();
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

  private alertPage(): void {
    this.alertsPagesService
      .alertPage(EnumPages.FRONT_VERSION)
      .toPromise()
      .then((res: any) => {});
  }

  private async getVersion(): Promise<void> {
    const versionInBD: string = (
      await this.bussinnerService
        .getItemFS(EnumBusinessParamsKeys.FRONT_DATA)
        .toPromise()
    ).data.version;

    if (versionInBD !== environment.version) this.alertPage();
  }
}
