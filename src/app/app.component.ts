import { Component, OnInit } from '@angular/core';
import { functions } from './helpers/functions';
import {
  BusinessParamsService,
  EnumBusinessParamsKeys,
} from './services/business-params.service';
import { IFireStoreRes } from './interface/ifireStoreRes';
import { LocalStorageEnum } from './enum/localStorageEnum';
import { FrontLogsService } from './services/front-logs.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'OnlyGram';

  constructor(
    private businessService: BusinessParamsService,
    private frontLogsService: FrontLogsService
  ) {
    this.deshabilitarClickYSeleccionDeTexto();
  }

  public async ngOnInit(): Promise<void> {
    document.body.style.removeProperty('min-height');
    await this.getBusinessParams();
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

  private async getBusinessParams(): Promise<void> {
    let res: IFireStoreRes = null;

    try {
      res = await this.businessService
        .getItemFS(EnumBusinessParamsKeys.PUBLIC_KEY)
        .toPromise();
    } catch (error) {
      this.frontLogsService.catchProcessError(
        error,
        {
          title: 'Error',
          text: 'Ha ocurrido un error',
          icon: 'error',
        },
        `file: forgot-password.component.ts: ~ ForgotPasswordComponent ~ onSubmit ~ JSON.stringify(error): ${JSON.stringify(
          error
        )}`
      );
    }

    console.log('🚀 ~ AppComponent ~ getBusinessParams ~ res:', res);

    if (res) {
      localStorage.setItem(LocalStorageEnum.PUBLIC_KEY, res.data.key);
    } else {
      throw new Error('Error con la encriptacion');
    }
  }
}
