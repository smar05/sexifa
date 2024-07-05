import { functions } from './../../../helpers/functions';
import { ModelsDTO } from './../../../dto/models-dto';
import {
  ActiveModelEnum,
  Imodels,
  ModelsAccountEnum,
} from './../../../interface/imodels';
import { ModelsService } from './../../../services/models.service';
import { FontAwesomeIconsService } from './../../../shared/font-awesome-icons/font-awesome-icons.service';
import {
  EnumCategoriesActive,
  Icategories,
} from './../../../interface/icategories';
import { CategoriesService } from './../../../services/categories.service';
import { Component, OnInit } from '@angular/core';
import { QueryFn } from '@angular/fire/compat/firestore';
import { IFireStoreRes } from 'src/app/interface/ifireStoreRes';
import { alerts } from 'src/app/helpers/alerts';
import { IFrontLogs } from 'src/app/interface/i-front-logs';
import { LocalStorageEnum } from 'src/app/enum/localStorageEnum';
import { FrontLogsService } from 'src/app/services/front-logs.service';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from 'src/app/services/orders.service';
import { Iorders } from 'src/app/interface/i-orders';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  public categories: Icategories[] | null = [];
  public models: ModelsDTO[] | null = [];
  public search: string = '';
  public byCategory: string = null;
  public pageSize: number = 10; // Tamaño de página: cantidad de documentos por página
  public lastDocument: string; // Último documento de la página anterior
  public load: boolean = false;

  constructor(
    private categoriesService: CategoriesService,
    private modelsService: ModelsService,
    private frontLogsService: FrontLogsService,
    public fontAwesomeIconsService: FontAwesomeIconsService,
    private route: ActivatedRoute,
    private ordersService: OrdersService
  ) {}

  async ngOnInit(): Promise<void> {
    functions.bloquearPantalla(true);
    let refEpayco: string = null;
    let searchOrder: boolean =
      localStorage.getItem(LocalStorageEnum.SEARCH_ORDER) === 'true';

    // Parametros de la url
    this.route.queryParams.subscribe((params) => {
      refEpayco = params['ref_epayco'];
    });

    await this.getAllCategories();
    try {
      await this.getAllModels();
    } catch (error) {
      console.error('Error: ', error);
      alerts.basicAlert(
        'Error',
        'Ha ocurrido un error en la consulta de modelos',
        'error'
      );

      let data: IFrontLogs = {
        date: new Date(),
        userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
        log: `file: home.component.ts: ~ HomeComponent ~ ngOnInit ~ JSON.stringify(error): ${JSON.stringify(
          error
        )}`,
      };

      this.frontLogsService
        .postDataFS(data)
        .then((res) => {})
        .catch((err) => {
          alerts.basicAlert('Error', 'Error', 'error');
          throw err;
        });
      functions.bloquearPantalla(false);
      throw error;
    }

    // Consultar la orden generada en la transaccion epayco
    if (refEpayco || searchOrder) {
      localStorage.removeItem(LocalStorageEnum.SEARCH_ORDER);

      await this.consultarOrden();
    }

    functions.bloquearPantalla(false);
  }

  private async consultarOrden(): Promise<void> {
    let qf: QueryFn = (ref) => ref.where('user_view', '==', false).limit(1);

    let res: IFireStoreRes[] = null;
    try {
      res = await this.ordersService.getDataFS(qf).toPromise();
    } catch (error) {
      console.error('Error: ', error);
      alerts.basicAlert(
        'Error',
        'Ha ocurrido un error en la consulta de la orden',
        'error'
      );

      let data: IFrontLogs = {
        date: new Date(),
        userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
        log: `file: home.component.ts: ~ HomeComponent ~ consultarOrden ~ JSON.stringify(error): ${JSON.stringify(
          error
        )}`,
      };

      this.frontLogsService
        .postDataFS(data)
        .then((res) => {})
        .catch((err) => {
          alerts.basicAlert('Error', 'Error', 'error');
          throw err;
        });
      throw error;
    }

    if (!res) return;

    let order: Iorders = { id: res[0].id, ...res[0].data };
    order.user_view = true;

    try {
      await this.ordersService.patchDataFS(order.id, order);
    } catch (error) {
      console.error('Error: ', error);
      alerts.basicAlert(
        'Error',
        'Ha ocurrido un error en la consulta de la orden',
        'error'
      );

      let data: IFrontLogs = {
        date: new Date(),
        userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
        log: `file: home.component.ts: ~ HomeComponent ~ consultarOrden ~ JSON.stringify(error): ${JSON.stringify(
          error
        )}`,
      };

      this.frontLogsService
        .postDataFS(data)
        .then((res) => {})
        .catch((err) => {
          alerts.basicAlert('Error', 'Error', 'error');
          throw err;
        });
      throw error;
    }

    // Limpiar el localStorage
    localStorage.removeItem(LocalStorageEnum.CART);
    localStorage.removeItem(LocalStorageEnum.INFO_MODEL_SUBSCRIPTION);
    localStorage.removeItem(LocalStorageEnum.VIEWS_MODEL);

    alerts.basicAlert(
      'Listo',
      `Numero de orden: ${order.id}.\nDentro de unos minutos, nuestro BOT te enviara los links de acceso de los grupos a tu Telegram.`,
      'success'
    );
  }

  public async clickSearch(): Promise<void> {
    try {
      await this.getModelsWhereSearchByName();
    } catch (error) {
      console.error('Error: ', error);
      alerts.basicAlert(
        'Error',
        'Ha ocurrido un error en la consulta de modelos pon nombre',
        'error'
      );

      let data: IFrontLogs = {
        date: new Date(),
        userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
        log: `file: home.component.ts: ~ HomeComponent ~ clickSearch ~ JSON.stringify(error): ${JSON.stringify(
          error
        )}`,
      };

      this.frontLogsService
        .postDataFS(data)
        .then((res) => {})
        .catch((err) => {
          alerts.basicAlert('Error', 'Error', 'error');
          throw err;
        });
      throw error;
    }
  }

  public async getAllCategories(): Promise<void> {
    let qf: QueryFn = (ref) =>
      ref.where('active', '==', EnumCategoriesActive.ACTIVE).orderBy('name');

    let data: IFireStoreRes[] = null;
    try {
      data = await this.categoriesService.getDataFS(qf).toPromise();
    } catch (error) {
      alerts.basicAlert(
        'Error',
        'Ha ocurrido un error en la consulta de categorias',
        'error'
      );
      console.error(error);

      let data: IFrontLogs = {
        date: new Date(),
        userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
        log: `file: home.component.ts: ~ HomeComponent ~ getAllCategories ~ JSON.stringify(error): ${JSON.stringify(
          error
        )}`,
      };

      this.frontLogsService
        .postDataFS(data)
        .then((res) => {})
        .catch((err) => {
          alerts.basicAlert('Error', 'Error', 'error');
          throw err;
        });
      throw error;
    }

    if (!data) return null;

    this.categories = data.map((d: IFireStoreRes) => {
      return { id: d.id, ...d.data };
    });
  }

  public findCategorie(id: string): Icategories {
    return this.categories.find((c: Icategories) => c.id === id) || null;
  }

  public async nextPagination(): Promise<void> {
    try {
      if (this.search) {
        await this.getAllModels('search_plus');
      } else if (this.byCategory) {
        await this.getAllModels(`category_${this.byCategory}_plus`);
      } else {
        await this.getAllModels('plus');
      }
    } catch (error) {
      console.error('Error: ', error);
      alerts.basicAlert(
        'Error',
        'Ha ocurrido un error en la consulta de modelos por paginacion',
        'error'
      );

      let data: IFrontLogs = {
        date: new Date(),
        userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
        log: `file: home.component.ts: ~ HomeComponent ~ nextPagination ~ JSON.stringify(error): ${JSON.stringify(
          error
        )}`,
      };

      this.frontLogsService
        .postDataFS(data)
        .then((res) => {})
        .catch((err) => {
          alerts.basicAlert('Error', 'Error', 'error');
          throw err;
        });
      throw error;
    }
  }

  public async getAllModels(consulta: string = ''): Promise<void> {
    functions.bloquearPantalla(true);
    this.load = true;
    let qr: QueryFn;
    this.search;

    if (consulta == '') {
      qr = (ref) =>
        ref
          .where('active', '==', ActiveModelEnum.ACTIVO)
          .where('account', '==', ModelsAccountEnum.PUBLIC)
          .orderBy('name')
          .limit(this.pageSize);
    } else if (consulta == 'plus') {
      qr = (ref) =>
        ref
          .where('active', '==', ActiveModelEnum.ACTIVO)
          .where('account', '==', ModelsAccountEnum.PUBLIC)
          .orderBy('name')
          .startAfter(this.lastDocument)
          .limit(this.pageSize);
    } else if (consulta == 'search') {
      this.models = [];
      this.lastDocument = '';

      qr = (ref) =>
        ref
          .where('active', '==', ActiveModelEnum.ACTIVO)
          .where('account', '==', ModelsAccountEnum.PUBLIC)
          .where('name', '>=', this.search)
          .where('name', '<=', this.search + '\uf8ff')
          .orderBy('name')
          .limit(this.pageSize);
    } else if (consulta == 'search_plus') {
      qr = (ref) =>
        ref
          .where('active', '==', ActiveModelEnum.ACTIVO)
          .where('account', '==', ModelsAccountEnum.PUBLIC)
          .where('name', '>=', this.search)
          .where('name', '<=', this.search + '\uf8ff')
          .orderBy('name')
          .startAfter(this.lastDocument)
          .limit(this.pageSize);
    } else if (consulta.includes('category')) {
      let idCategoria: string = consulta.split('_')[1];
      this.byCategory = idCategoria;

      this.models = [];
      this.lastDocument = '';

      qr = (ref) =>
        ref
          .where('active', '==', ActiveModelEnum.ACTIVO)
          .where('account', '==', ModelsAccountEnum.PUBLIC)
          .where('categorie', '==', idCategoria)
          .limit(this.pageSize);
    } else if (consulta.includes('category') && consulta.includes('plus')) {
      qr = (ref) =>
        ref
          .where('active', '==', ActiveModelEnum.ACTIVO)
          .where('account', '==', ModelsAccountEnum.PUBLIC)
          .where('categorie', '==', this.byCategory)
          .orderBy('name')
          .startAfter(this.lastDocument)
          .limit(this.pageSize);
    }

    let res: IFireStoreRes[] = [];

    try {
      res = await this.modelsService.getDataFS(qr).toPromise();
    } catch (error) {
      console.error('Error: ', error);
      alerts.basicAlert(
        'Error',
        'Ha ocurrido un error en la consulta de modelos',
        'error'
      );

      let data: IFrontLogs = {
        date: new Date(),
        userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
        log: `file: home.component.ts: ~ HomeComponent ~ getAllModels ~ JSON.stringify(error): ${JSON.stringify(
          error
        )}`,
      };

      this.frontLogsService
        .postDataFS(data)
        .then((res) => {})
        .catch((err) => {
          alerts.basicAlert('Error', 'Error', 'error');
          throw err;
        });
      throw error;
    }
    // Guardar referencia al último documento de la página actual
    if (res.length > 0) {
      this.lastDocument = res[res.length - 1].data.name;
    }

    let imodels: Imodels[] = res.map((a: IFireStoreRes) => {
      return { id: a.id, ...a.data };
    });

    //Imodel to DTO
    imodels.forEach(async (imodel: Imodels) => {
      try {
        this.models?.push(await this.modelsService.modelInterfaceToDTO(imodel));
      } catch (error) {
        console.error('Error: ', error);
        alerts.basicAlert(
          'Error',
          'Ha ocurrido un error en la conversion de modelos a DTO',
          'error'
        );

        let data: IFrontLogs = {
          date: new Date(),
          userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
          log: `file: home.component.ts:284 ~ HomeComponent ~ imodels.forEach ~ JSON.stringify(error): ${JSON.stringify(
            error
          )}`,
        };

        this.frontLogsService
          .postDataFS(data)
          .then((res) => {})
          .catch((err) => {
            alerts.basicAlert('Error', 'Error', 'error');
            throw err;
          });
        throw error;
      }
    });
    functions.bloquearPantalla(false);
    this.load = false;
  }

  public async getModelsWhereSearchByName(): Promise<void> {
    if (!this.search) {
      this.models = [];
      try {
        await this.getAllModels();
      } catch (error) {
        console.error('Error: ', error);
        alerts.basicAlert(
          'Error',
          'Ha ocurrido un error en la consulta de modelos',
          'error'
        );

        let data: IFrontLogs = {
          date: new Date(),
          userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
          log: `file: home.component.ts: ~ HomeComponent ~ getModelsWhereSearchByName ~ JSON.stringify(error): ${JSON.stringify(
            error
          )}`,
        };

        this.frontLogsService
          .postDataFS(data)
          .then((res) => {})
          .catch((err) => {
            alerts.basicAlert('Error', 'Error', 'error');
            functions.bloquearPantalla(false);
            this.load = false;
            throw err;
          });
        functions.bloquearPantalla(false);
        this.load = false;
        throw error;
      }
      return;
    }

    try {
      await this.getAllModels('search');
    } catch (error) {
      console.error('Error: ', error);
      alerts.basicAlert(
        'Error',
        'Ha ocurrido un error en la consulta de modelos',
        'error'
      );

      let data: IFrontLogs = {
        date: new Date(),
        userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
        log: `file: home.component.ts: ~ HomeComponent ~ getModelsWhereSearchByName ~ JSON.stringify(error): ${JSON.stringify(
          error
        )}`,
      };

      this.frontLogsService
        .postDataFS(data)
        .then((res) => {})
        .catch((err) => {
          alerts.basicAlert('Error', 'Error', 'error');
          functions.bloquearPantalla(false);
          this.load = false;
          throw err;
        });
      functions.bloquearPantalla(false);
      this.load = false;
      throw error;
    }
  }

  public getUrlModel(model: ModelsDTO) {
    return this.modelsService.getRouterLinkUrl(model);
  }

  capitalizeFirstLetters(text: string): string {
    return functions.capitalizeFirstLetters(text);
  }
}
