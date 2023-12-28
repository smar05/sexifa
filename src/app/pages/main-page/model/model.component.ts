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

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.css'],
})
export class ModelComponent implements OnInit {
  public model: ModelsDTO = {};
  public modelId: string = '';
  public galeria: string[] = [];
  public imgPrincipal: string = '';
  public timeSubscriptionInput: any[] = [];
  public price!: IpriceModel | undefined;
  public load: boolean = false;
  private userId: string = '';

  constructor(
    private route: ActivatedRoute,
    private modelsService: ModelsService,
    private router: Router,
    private subscriptionsService: SubscriptionsService,
    private viewsModelService: ViewsModelService
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
    }

    if (!this.model || Object.keys(this.model).length === 0) return;

    this.setModelSubscripctionModelValues();

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
    }
    functions.bloquearPantalla(false);
  }

  public async getModel(): Promise<void> {
    functions.bloquearPantalla(true);
    this.load = true;
    let res1: IFireStoreRes = null;

    try {
      res1 = await this.modelsService.getItemFS(this.modelId || '').toPromise();
    } catch (error) {
      console.error('Error: ', error);
      alerts.basicAlert(
        'Error',
        'Ha ocurrido un error en la consulta de modelos',
        'error'
      );
    }

    // Si no se encuentra un modelo con el id colocado en la url
    if (!res1) {
      this.router.navigate([`/${UrlPagesEnum.HOME}`]);

      alerts.basicAlert(
        'Error',
        'No se ha encontrado la informacion solicitada',
        'error'
      );

      return;
    }

    let res: Imodels = res1.data;
    res.id = res1.id;

    res.price = res.price.sort(
      (a: IpriceModel, b: IpriceModel) => a.time - b.time
    );

    if (res.active != ActiveModelEnum.ACTIVO)
      this.router.navigate([`/${UrlPagesEnum.HOME}`]);

    res.id = this.modelId;
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
    }
    this.imgPrincipal = this.model.mainImage || '';

    functions.bloquearPantalla(false);
    this.load = false;
  }

  public async getGaleria(): Promise<void> {
    try {
      this.galeria = await this.modelsService.getImages(
        `${this.modelId}/gallery`
      );
    } catch (error) {
      console.error('Error: ', error);
      alerts.basicAlert(
        'Error',
        'Ha ocurrido un error en la obtencion de la galeria',
        'error'
      );
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
    if (this.price?.value && this.price?.value_offer) {
      return this.modelsService.calculoPrecioSubscripcion(this.price);
    }

    return this.price?.value;
  }

  public async clickParticipar(): Promise<void> {
    functions.bloquearPantalla(true);
    this.load = true;

    try {
      let userId: string = localStorage.getItem(LocalStorageEnum.LOCAL_ID);
      let qf: QueryFn = (ref) =>
        ref
          .where('modelId', '==', this.modelId)
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
      functions.bloquearPantalla(false);
      this.load = false;
      console.error(error);
    }
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
      }
    }
  }
}
