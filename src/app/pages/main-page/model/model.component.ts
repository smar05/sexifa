import { UrlPagesEnum } from './../../../enum/urlPagesEnum';
import { IpriceModel } from './../../../interface/iprice-model';
import { ActiveModelEnum, Imodels } from './../../../interface/imodels';
import { ModelsService } from './../../../services/models.service';
import { ModelsDTO } from './../../../dto/models-dto';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IInfoModelSubscription } from 'src/app/interface/i-info-model-subscription';
import { LocalStorageEnum } from 'src/app/enum/localStorageEnum';
import { IFireStoreRes } from 'src/app/interface/ifireStoreRes';
import { SubscriptionsService } from 'src/app/services/subscriptions.service';
import { QueryFn } from '@angular/fire/compat/firestore';
import { StatusSubscriptionsEnum } from 'src/app/enum/statusSubscriptionsEnum';
import { Isubscriptions } from 'src/app/interface/i- subscriptions';
import { alerts } from 'src/app/helpers/alerts';
import { ViewsModelService } from 'src/app/services/views-model.service';
import { IviewsModel } from 'src/app/interface/i-views-model';
import { functions } from 'src/app/helpers/functions';
import { IFrontLogs } from 'src/app/interface/i-front-logs';
import { FrontLogsService } from 'src/app/services/front-logs.service';
import { TelegramLocalService } from 'src/app/services/telegram-local.service';
import { UserService } from 'src/app/services/user.service';
import { Iuser } from 'src/app/interface/iuser';
import { CategoriesService } from 'src/app/services/categories.service';
import { Icategories } from 'src/app/interface/icategories';
import { FontAwesomeIconsService } from 'src/app/shared/font-awesome-icons/font-awesome-icons.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.css'],
})
export class ModelComponent implements OnInit {
  public model: ModelsDTO = {} as any;
  public modelId: string = '';
  public galeria: string[] = [];
  public imgPrincipal: string = '';
  public timeSubscriptionInput: any[] = [];
  public price!: IpriceModel | undefined;
  public load: boolean = false;
  private userId: string = '';
  private user: Iuser = {};
  public precios: Array<number> = [];
  public category: Icategories = null;

  constructor(
    private route: ActivatedRoute,
    private modelsService: ModelsService,
    private router: Router,
    private subscriptionsService: SubscriptionsService,
    private viewsModelService: ViewsModelService,
    private frontLogsService: FrontLogsService,
    private telegramService: TelegramLocalService,
    private userService: UserService,
    private categoriesService: CategoriesService,
    public fontAwesomeIconsService: FontAwesomeIconsService
  ) {}

  async ngOnInit(): Promise<void> {
    functions.bloquearPantalla(true);
    //Id del modelo
    this.modelId = this.route.snapshot.paramMap.get('url') || '';

    this.userId = localStorage.getItem(LocalStorageEnum.LOCAL_ID);

    try {
      await this.getModel();
    } catch (error) {
      console.error('Error: ', error);
      alerts.basicAlert(
        'Error',
        'Ha ocurrido un error en la consulta de modelo',
        'error'
      );

      let data: IFrontLogs = {
        date: new Date(),
        userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
        log: `file: model.component.ts: ~ ModelComponent ~ ngOnInit ~ JSON.stringify(error): ${JSON.stringify(
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

    await this.getCategory(this.model.categorie);

    try {
      await this.getUser();
    } catch (error) {
      console.error('Error: ', error);
      alerts.basicAlert(
        'Error',
        'Ha ocurrido un error en la consulta de usuario',
        'error'
      );

      let data: IFrontLogs = {
        date: new Date(),
        userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
        log: `file: model.component.ts: ~ ModelComponent ~ ngOnInit ~ JSON.stringify(error): ${JSON.stringify(
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

    if (!this.model || Object.keys(this.model).length === 0) return;

    await this.botEsAdminDelGrupo();

    this.setModelSubscripctionModelValues();

    try {
      await this.calcularPrecios();
    } catch (error) {
      console.error('Error: ', error);
      alerts.basicAlert(
        'Error',
        'Ha ocurrido un error en la consulta de precios',
        'error'
      );

      let data: IFrontLogs = {
        date: new Date(),
        userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
        log: `file: model.component.ts: ~ ModelComponent ~ ngOnInit ~ JSON.stringify(error): ${JSON.stringify(
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

    // Guardamos la visita del usuario a la pagina
    try {
      await this.setViewsModelData();
    } catch (error) {
      console.error('Error: ', error);
      alerts.basicAlert(
        'Error',
        'Ha ocurrido un error al guardar la visita',
        'error'
      );

      let data: IFrontLogs = {
        date: new Date(),
        userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
        log: `file: model.component.ts: ~ ModelComponent ~ ngOnInit ~ JSON.stringify(error): ${JSON.stringify(
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
    functions.bloquearPantalla(false);
  }

  private async getCategory(id: string): Promise<void> {
    let data: IFireStoreRes = null;
    try {
      data = await this.categoriesService.getItemFS(id).toPromise();
    } catch (error) {
      console.error('Error: ', error);
      alerts.basicAlert(
        'Error',
        'Ha ocurrido un error en la consulta de usuario',
        'error'
      );

      let data: IFrontLogs = {
        date: new Date(),
        userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
        log: `file: model.component.ts: ~ ModelComponent ~ getCategory ~ JSON.stringify(error): ${JSON.stringify(
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

    this.category = { id: data.id, ...data.data };
  }

  public async getUser(): Promise<void> {
    functions.bloquearPantalla(true);

    let qf: QueryFn = (ref) =>
      ref.where('id', '==', localStorage.getItem(LocalStorageEnum.LOCAL_ID));

    let res: IFireStoreRes[] = null;

    try {
      res = await this.userService.getDataFS(qf).toPromise();
    } catch (error) {
      console.error('Error: ', error);
      alerts.basicAlert(
        'Error',
        'Ha ocurrido un error en la consulta de usuario',
        'error'
      );

      let data: IFrontLogs = {
        date: new Date(),
        userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
        log: `file: model.component.ts: ~ ModelComponent ~ getUser ~ JSON.stringify(error): ${JSON.stringify(
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

    // Si no se encuentra un usuario
    if (!res) {
      this.router.navigate([`/${UrlPagesEnum.HOME}`]);

      alerts.basicAlert(
        'Error',
        'No se ha encontrado la informacion solicitada',
        'error'
      );

      return;
    }

    this.user = res[0].data;
    this.user.id = res[0].id;

    functions.bloquearPantalla(false);
  }

  public async getModel(): Promise<void> {
    functions.bloquearPantalla(true);
    this.load = true;
    let res1: IFireStoreRes[] = null;

    try {
      let qf: QueryFn = (ref) =>
        ref
          .where('url', '==', this.modelId)
          .where('active', '==', ActiveModelEnum.ACTIVO)
          .limit(1);

      res1 = await this.modelsService.getDataFS(qf).toPromise();
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
        log: `file: model.component.ts: ~ ModelComponent ~ getModel ~ JSON.stringify(error): ${JSON.stringify(
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

    let res2: IFireStoreRes = null;

    if (!res1 || res1.length == 0) {
      try {
        let qf: QueryFn = (ref) =>
          ref.where('active', '==', ActiveModelEnum.ACTIVO);
        res2 = await this.modelsService
          .getItemFS(this.modelId || '', qf)
          .toPromise();
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
          log: `file: model.component.ts: ~ ModelComponent ~ getModel ~ JSON.stringify(error): ${JSON.stringify(
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

    // Si no se encuentra un modelo con el id colocado en la url
    if ((!res1 || res1.length == 0) && !res2) {
      this.router.navigate([`/${UrlPagesEnum.HOME}`]);

      alerts.basicAlert(
        'Error',
        'No se ha encontrado la informacion solicitada',
        'error'
      );

      return;
    }

    let res: Imodels =
      res1 && res1.length > 0
        ? { id: res1[0].id, ...res1[0].data }
        : res2
        ? { id: res2.id, ...res2.data }
        : null;

    if (!res) {
      this.router.navigate([`/${UrlPagesEnum.HOME}`]);

      alerts.basicAlert(
        'Error',
        'No se ha encontrado la informacion solicitada',
        'error'
      );

      return;
    }

    res.price = res.price.sort(
      (a: IpriceModel, b: IpriceModel) => a.time - b.time
    );

    if (res.active != ActiveModelEnum.ACTIVO)
      this.router.navigate([`/${UrlPagesEnum.HOME}`]);

    //Interface to DTO
    try {
      this.model = await this.modelsService.modelInterfaceToDTO(res);
    } catch (error) {
      console.error('Error: ', error);
      alerts.basicAlert(
        'Error',
        'Ha ocurrido un error en la conversion de modelo a DTO',
        'error'
      );

      let data: IFrontLogs = {
        date: new Date(),
        userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
        log: `file: model.component.ts: ~ ModelComponent ~ getModel ~ JSON.stringify(error): ${JSON.stringify(
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
    this.imgPrincipal = this.model.mainImage || '';

    functions.bloquearPantalla(false);
    this.load = false;
  }

  public async getGaleria(): Promise<void> {
    try {
      this.galeria = await this.modelsService.getImages(
        `${this.model.id}/gallery`
      );
    } catch (error) {
      console.error('Error: ', error);
      alerts.basicAlert(
        'Error',
        'Ha ocurrido un error en la obtencion de la galeria',
        'error'
      );

      let data: IFrontLogs = {
        date: new Date(),
        userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
        log: `file: model.component.ts: ~ ModelComponent ~ getGaleria ~ JSON.stringify(error): ${JSON.stringify(
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

  public setImgPrincipal(img: string): void {
    this.imgPrincipal = img;
  }

  public setModelSubscripctionModelValues(): void {
    this.model.price?.forEach((price: IpriceModel) => {
      this.timeSubscriptionInput.push({ time: price.time, checked: false });
    });
  }

  public subscriptionModelInputChange(i: number): void {
    let valueChecked: boolean = this.timeSubscriptionInput[i].checked;

    this.timeSubscriptionInput.forEach((input: any) => {
      input.checked = false;
    });

    this.timeSubscriptionInput[i].checked = !valueChecked;

    if (this.timeSubscriptionInput[i].checked) {
      let price: IpriceModel | undefined = this.model.price?.find(
        (price: IpriceModel) => price.time == this.timeSubscriptionInput[i].time
      );

      this.price = price ? price : undefined;
    } else {
      this.price = undefined;
    }
  }

  public calculoPrecioSubscripcion(): number | undefined {
    if (!this.price) {
      return undefined;
    }

    let indexPrecio: number = this.model.price.findIndex(
      (p: IpriceModel) =>
        p.value === this.price.value && p.time === this.price.time
    );

    if (indexPrecio >= 0) {
      return this.precios[indexPrecio];
    }

    return undefined;
  }

  private async calcularPrecios(): Promise<void> {
    functions.bloquearPantalla(true);
    this.load = true;

    let prices: IpriceModel[] = this.model.price;
    let params: object = {
      prices: JSON.stringify(prices),
      fechaActual: new Date().toISOString(),
    };

    this.precios = [];

    try {
      this.precios = (
        await this.modelsService.calcularPrecioSubscripcion(params).toPromise()
      ).preciosCalculados;
    } catch (error) {
      console.error('Error: ', error);
      alerts.basicAlert(
        'Error',
        'Ha ocurrido un error en la consulta de precios',
        'error'
      );

      let data: IFrontLogs = {
        date: new Date(),
        userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
        log: `file: model.component.ts: ~ ModelComponent ~ calcularPrecios ~ JSON.stringify(error): ${JSON.stringify(
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
      this.load = false;
      throw error;
    }

    functions.bloquearPantalla(false);
    this.load = false;
  }

  public async clickParticipar(): Promise<void> {
    functions.bloquearPantalla(true);
    this.load = true;

    try {
      // Consular si ya pertenece al grupo

      let res: any = null;
      try {
        let params: object = {
          fromId: this.user.chatId,
          chatId: this.model.groupId,
        };

        res = await this.telegramService.esMiembroDelGrupo(params).toPromise();
      } catch (error) {
        console.error('Error: ', error);
        alerts.basicAlert(
          'Error',
          'Ha ocurrido un error en la consulta de pertenencia al grupo',
          'error'
        );

        let data: IFrontLogs = {
          date: new Date(),
          userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
          log: `file: model.component.ts: ~ ModelComponent ~ clickParticipar ~ JSON.stringify(error): ${JSON.stringify(
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

      if (!res || res.perteneceAlGrupo) {
        functions.bloquearPantalla(false);
        this.load = false;
        alerts.basicAlert('Error', 'Ya perteneces a este grupo', 'error');
        return;
      }

      // COnsultar las subscripciones activas
      let userId: string = localStorage.getItem(LocalStorageEnum.LOCAL_ID);
      let qf: QueryFn = (ref) =>
        ref
          .where('modelId', '==', this.model.id)
          .where('userId', '==', userId)
          .where('status', '==', StatusSubscriptionsEnum.ACTIVO);

      let subscritionsActivas: Isubscriptions[] = null;

      try {
        subscritionsActivas = await this.subscriptionsService
          .getDataFS(qf)
          .toPromise();
      } catch (error) {
        console.error('Error: ', error);
        alerts.basicAlert(
          'Error',
          'Ha ocurrido un error en la consulta de subscripciones',
          'error'
        );

        let data: IFrontLogs = {
          date: new Date(),
          userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
          log: `file: model.component.ts: ~ ModelComponent ~ clickParticipar ~ JSON.stringify(error): ${JSON.stringify(
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

      if (subscritionsActivas && subscritionsActivas.length > 0) {
        functions.bloquearPantalla(false);
        this.load = false;

        alerts.basicAlert(
          'Error',
          'Ya cuenta con una subscripcion activa para este grupo',
          'error'
        );
        return;
      }

      let infoModelSubscription: IInfoModelSubscription = localStorage.getItem(
        LocalStorageEnum.INFO_MODEL_SUBSCRIPTION
      )
        ? JSON.parse(
            localStorage.getItem(LocalStorageEnum.INFO_MODEL_SUBSCRIPTION) || ''
          )
        : {};

      infoModelSubscription = {
        idModel: this.model.id,
        timeSubscription: this.timeSubscriptionInput.find(
          (timeSubscription: any) => timeSubscription.checked
        ).time,
      };

      localStorage.setItem(
        LocalStorageEnum.INFO_MODEL_SUBSCRIPTION,
        JSON.stringify(infoModelSubscription)
      );

      let cart: IInfoModelSubscription[] = localStorage.getItem(
        LocalStorageEnum.CART
      )
        ? JSON.parse(localStorage.getItem(LocalStorageEnum.CART) || '')
        : [];

      // Miramos si ya existe en el carrito
      let modelInfoSubscriptionIndex: number = cart.findIndex(
        (infoModelSubscription2: IInfoModelSubscription) =>
          infoModelSubscription2.idModel == this.model.id
      );

      // Si existe en el carrito
      if (modelInfoSubscriptionIndex >= 0) {
        cart[modelInfoSubscriptionIndex] = infoModelSubscription;
      } else {
        cart.push(infoModelSubscription);
      }

      localStorage.setItem(LocalStorageEnum.CART, JSON.stringify(cart));

      functions.bloquearPantalla(false);
      this.load = false;

      this.router.navigateByUrl(`/${UrlPagesEnum.CHECKOUT}`);
    } catch (error) {
      console.error('Error: ', error);

      let data: IFrontLogs = {
        date: new Date(),
        userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
        log: `file: model.component.ts: ~ ModelComponent ~ clickParticipar ~ JSON.stringify(error): ${JSON.stringify(
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
      this.load = false;

      throw error;
    }
  }

  private async botEsAdminDelGrupo(): Promise<void> {
    functions.bloquearPantalla(true);
    this.load = true;

    let res: any = null;
    try {
      let params: { chatId: number } = {
        chatId: this.model.groupId as number,
      };

      res = await this.telegramService.botEsAdminDelGrupo(params).toPromise();
    } catch (error) {
      console.error('Error: ', error);
      alerts.basicAlert(
        'Error',
        'Ha ocurrido un error en la consulta de pertenencia al grupo del bot',
        'error'
      );

      let data: IFrontLogs = {
        date: new Date(),
        userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
        log: `file: model.component.ts: ~ ModelComponent ~ botEsAdminDelGrupo ~ JSON.stringify(error): ${JSON.stringify(
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

    if (!res?.perteneceAlGrupo) {
      functions.bloquearPantalla(false);
      this.load = false;
      alerts.basicAlert('Error', 'Ha ocurrido un error con el grupo', 'error');
      this.router.navigate([`/${UrlPagesEnum.HOME}`]);
      return;
    }

    functions.bloquearPantalla(false);
    this.load = false;
  }

  public async setViewsModelData(): Promise<void> {
    let viewsLocal: string[] = localStorage.getItem(
      LocalStorageEnum.VIEWS_MODEL
    )
      ? JSON.parse(localStorage.getItem(LocalStorageEnum.VIEWS_MODEL))
      : [];

    // Si no esta guardado en local, lo añadimos y guardamos en la bd
    if (!viewsLocal.find((v: string) => v == this.model.id)) {
      // Se añade a local
      viewsLocal.push(this.model.id);
      localStorage.setItem(
        LocalStorageEnum.VIEWS_MODEL,
        JSON.stringify(viewsLocal)
      );

      // Guardamos la nueva vista en la bd
      let viewData: IviewsModel = {
        modelId: this.model.id,
        fecha: new Date().toISOString().split('T')[0],
        userId: this.userId,
      };

      try {
        await this.viewsModelService.postDataFS(viewData);
      } catch (error) {
        console.error('Error: ', error);
        alerts.basicAlert(
          'Error',
          'Ha ocurrido un error al guardar la visita',
          'error'
        );

        let data: IFrontLogs = {
          date: new Date(),
          userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
          log: `file: model.component.ts: ~ ModelComponent ~ setViewsModelData ~ JSON.stringify(error): ${JSON.stringify(
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
  }

  public getUrlPrueba(red: string): string {
    switch (red) {
      case 'facebook':
        return environment.urlRedes.facebook + this.model.redes.facebook;

      case 'instagram':
        return environment.urlRedes.instagram + this.model.redes.instagram;

      case 'x':
        return environment.urlRedes.x + this.model.redes.x;

      case 'tiktok':
        return environment.urlRedes.tiktok + this.model.redes.tiktok;

      case 'threads':
        return environment.urlRedes.threads + this.model.redes.threads;

      default:
        return null;
    }
  }
}
