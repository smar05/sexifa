import { ActivatedRoute, Router } from '@angular/router';
import {
  IpriceModel,
  PriceTypeLimitEnum,
} from './../../../interface/iprice-model';
import { Imodels } from './../../../interface/imodels';
import { ModelsService } from './../../../services/models.service';
import { IInfoModelSubscription } from './../../../interface/i-info-model-subscription';
import { Iuser } from './../../../interface/iuser';
import { UserService } from './../../../services/user.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ICart } from 'src/app/interface/i-cart';
import { LocalStorageEnum } from 'src/app/enum/localStorageEnum';
import { alerts } from 'src/app/helpers/alerts';
import { PayPalStatusEnum } from 'src/app/enum/paypalStatusEnum';
import { environment } from 'src/environments/environment';
import { Md5 } from 'md5-typescript';
import { TelegramLocalService } from 'src/app/services/telegram-local.service';
import { QueryFn } from '@angular/fire/compat/firestore';
import { IFireStoreRes } from 'src/app/interface/ifireStoreRes';
import { Isubscriptions } from 'src/app/interface/i- subscriptions';
import { StatusSubscriptionsEnum } from 'src/app/enum/statusSubscriptionsEnum';
import { functions } from 'src/app/helpers/functions';
import { PayMethodsEnum } from 'src/app/enum/payMethodsEnum';
import { SubscriptionsService } from 'src/app/services/subscriptions.service';
import { UrlPagesEnum } from 'src/app/enum/urlPagesEnum';
import { OrdersService } from 'src/app/services/orders.service';
import { Iorders } from 'src/app/interface/i-orders';
import { StatusOrdersEnum } from 'src/app/enum/statusOrdersEnum';
import { CurrencyConverterService } from 'src/app/services/currency-converter.service';
import { ModelStatusEnum } from 'src/app/enum/modelStatusEnum';
import { CurrencyEnum } from 'src/app/enum/currencyEnum';
import { FrontLogsService } from 'src/app/services/front-logs.service';
import { BusinessParamsService } from 'src/app/services/business-params.service';
import { MetodosDePagoService } from 'src/app/services/metodos-de-pago.service';
import {
  EnumMetodosDePagoStatus,
  IMetodosDePago,
} from 'src/app/interface/i-metodos-de-pago';
import { EnumEndpointsBack } from 'src/app/enum/enum-endpoints-back';
import { TokenService } from 'src/app/services/token.service';
import { AlertsPagesService } from 'src/app/services/alerts-page.service';
import { EnumPages } from 'src/app/enum/enum-pages';
import { IButtonComponent } from 'src/app/shared/button/button.component';

declare var paypal: any;
declare const ePayco: any;

type QParamsPayU = {
  transactionState: string;
  TX_VALUE: string;
  currency: string;
  processingDate: string;
  transactionId: string;
};

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  public user: Iuser = {} as any;
  public cartLocal: IInfoModelSubscription[] = []; // Carrito de localstorage en local
  public cart: ICart[] = []; // Objeto que se muestra en pantalla
  public total: number = 0;
  public payMethod!: string;
  public load: boolean = false;
  public models: Imodels[] = [];
  public metodosDePago: IMetodosDePago[] = null;
  public epaycoProperties: IButtonComponent = {
    style: 'padding: 0; background: none; border: none; cursor: pointer;',
    class: 'epayco-button-render btn btn-block',
    text: '<img src="https://multimedia.epayco.co/dashboard/btns/btn2.png" alt="" />',
    id: 'epayco-btn',
  };

  @ViewChild('paypal', { static: true })
  paypalElement!: ElementRef;

  constructor(
    private userService: UserService,
    private modelsService: ModelsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private telegramLocalService: TelegramLocalService,
    private subscriptionsService: SubscriptionsService,
    private ordersService: OrdersService,
    private currencyConverterService: CurrencyConverterService,
    private frontLogsService: FrontLogsService,
    private businessParamsService: BusinessParamsService,
    private metodosDePagoService: MetodosDePagoService,
    private tokenService: TokenService,
    private alertsPagesService: AlertsPagesService
  ) {}

  async ngOnInit(): Promise<void> {
    functions.bloquearPantalla(true);

    this.alertPage();

    try {
      await this.getUserData();
    } catch (error) {
      this.frontLogsService.catchProcessError(
        error,
        {
          title: 'Error',
          text: 'Ha ocurrido un error en la consulta del carrito',
          icon: 'error',
        },
        `file: checkout.component.ts: ~ CheckoutComponent ~ ngOnInit ~ JSON.stringify(error): ${JSON.stringify(
          error
        )}`
      );
    }

    try {
      await this.getCartData();
    } catch (error) {
      this.frontLogsService.catchProcessError(
        error,
        {
          title: 'Error',
          text: 'Ha ocurrido un error en la consulta del carrito',
          icon: 'error',
        },
        `file: checkout.component.ts: ~ CheckoutComponent ~ ngOnInit ~ JSON.stringify(error): ${JSON.stringify(
          error
        )}`
      );
    }

    try {
      await this.ifPayU();
    } catch (error) {
      this.frontLogsService.catchProcessError(
        error,
        {
          title: 'Error',
          text: 'Ha ocurrido un error con el metodo PayU',
          icon: 'error',
        },
        `file: checkout.component.ts: ~ CheckoutComponent ~ ngOnInit ~ JSON.stringify(error): ${JSON.stringify(
          error
        )}`
      );
    }

    await this.getMetodosDePago();

    this.paypalData();
    functions.bloquearPantalla(false);
    this.load = false;
  }

  /**
   * Consulta si el pago se hizo por PayU
   *
   * @private
   * @return {*}  {Promise<void>}
   * @memberof CheckoutComponent
   */
  private async ifPayU(): Promise<void> {
    let params: QParamsPayU = this.activatedRoute.snapshot.queryParams as any;

    let payProceso: Date = new Date(
      localStorage.getItem(LocalStorageEnum.PAYU_PROCESO) || ''
    );

    localStorage.removeItem(LocalStorageEnum.PAYU_PROCESO);
    if (params.transactionState && payProceso < new Date()) {
      try {
        await this.payUProcess(params);
      } catch (error) {
        this.frontLogsService.catchProcessError(
          error,
          {
            title: 'Error',
            text: 'Ha ocurrido un error con el proceso de PayU',
            icon: 'error',
          },
          `file: checkout.component.ts: ~ CheckoutComponent ~ ifPayU ~ JSON.stringify(error): ${JSON.stringify(
            error
          )}`
        );
      }
    }
  }

  private async getCommision(): Promise<number> {
    let data: IFireStoreRes = null;

    try {
      data = await this.businessParamsService
        .getItemFS('commission')
        .toPromise();
    } catch (err) {
      this.frontLogsService.catchProcessError(
        err,
        {
          title: 'Error',
          text: 'Ha ocurrido un error enviando el correo de verificacion',
          icon: 'error',
        },
        `file: checkout.component.ts: ~ CheckoutComponent ~ getComission ~ JSON.stringify(error): ${JSON.stringify(
          err
        )}`
      );
    }

    return data.data.value;
  }

  /**
   * Guarda la informacion de la compra de las subscripciones por payu
   *
   * @private
   * @param {QParamsPayU} params
   * @return {*}  {Promise<void>}
   * @memberof CheckoutComponent
   */
  private async payUProcess(params: QParamsPayU): Promise<void> {
    const timeNow: Date = new Date();
    let userId: string = localStorage.getItem(LocalStorageEnum.LOCAL_ID);
    let usd_cop: number = null;

    try {
      usd_cop = Number(
        (
          await this.currencyConverterService
            .getCurrencyConverter(`${params.currency}_COP`, 1)
            .toPromise()
        ).rates.COP.rate
      );
    } catch (error) {
      this.frontLogsService.catchProcessError(
        error,
        {
          title: 'Error',
          text: 'Ha ocurrido un error en la conversion de la moneda',
          icon: 'error',
        },
        `file: checkout.component.ts: ~ CheckoutComponent ~ payUProcess ~ JSON.stringify(error): ${JSON.stringify(
          error
        )}`
      );
    }

    let dataSubscriptions: Isubscriptions[] = [];

    switch (params.transactionState) {
      // APPROVED
      case '4':
        let cart: ICart[] = [...this.cart];

        let commission: number = await this.getCommision();

        // Se organiza la informacion de las subscripciones compradas
        for (const cart1 of cart) {
          let endTime: Date = functions.incrementarMeses(
            timeNow,
            cart1.infoModelSubscription.timeSubscription
          );

          let data: Isubscriptions = {
            modelId: cart1.model.id,
            userId,
            status: StatusSubscriptionsEnum.PAGADO,
            price: cart1.price,
            time: cart1.infoModelSubscription.timeSubscription,
            beginTime: timeNow.toISOString().split('T')[0],
            endTime: endTime.toISOString().split('T')[0],
            date_created: new Date().toISOString(),
            payMethod: PayMethodsEnum.PAYU,
            usd_cop,
            modelStatus: ModelStatusEnum.PENDIENTE_PAGO,
            commission,
          };

          dataSubscriptions.push(data);
        }

        // Se guarda la informacion de las subscripciones compradas
        let idsSubscriptions: string[] = [];
        for (const data of dataSubscriptions) {
          let res: any = null;

          try {
            res = await this.subscriptionsService.postDataFS(data);
          } catch (error) {
            this.frontLogsService.catchProcessError(
              error,
              {
                title: 'Error',
                text: 'Ha ocurrido un error en la consulta de subscripciones',
                icon: 'error',
              },
              `file: checkout.component.ts: ~ CheckoutComponent ~ payUProcess ~ JSON.stringify(error): ${JSON.stringify(
                error
              )}`
            );
          }

          idsSubscriptions.push(res.id);

          // Reducir la compra si esta en promocion
          await this.reducirComprasPromocion(data);
        }

        let dataOrder: Iorders = {
          date_created: new Date().toISOString(),
          ids_subscriptions: idsSubscriptions,
          userId,
          status: StatusOrdersEnum.PAGADO,
          payMethod: PayMethodsEnum.PAYU,
          price: Number(params.TX_VALUE),
          usd_cop,
          idPay: params.transactionId,
          currency: params.currency,
        };

        let orderId: string = null;

        try {
          orderId = (await this.ordersService.postDataFS(dataOrder)).id;
        } catch (error) {
          this.frontLogsService.catchProcessError(
            error,
            {
              title: 'Error',
              text: 'Ha ocurrido un error al guardar la orden',
              icon: 'error',
            },
            `file: checkout.component.ts: ~ CheckoutComponent ~ payUProcess ~ JSON.stringify(error): ${JSON.stringify(
              error
            )}`
          );
        }

        localStorage.removeItem(LocalStorageEnum.CART);
        localStorage.removeItem(LocalStorageEnum.INFO_MODEL_SUBSCRIPTION);

        try {
          await this.telegramLocalService
            .getLinksOrden({ orderId })
            .toPromise();
        } catch (error) {
          this.frontLogsService.catchProcessError(
            error,
            {
              title: 'Error',
              text: 'Ha ocurrido un error en la obtencion de los links de los grupos',
              icon: 'error',
            },
            `file: checkout.component.ts: ~ CheckoutComponent ~ payUProcess ~ JSON.stringify(error): ${JSON.stringify(
              error
            )}`
          );
        }

        alerts.basicAlert(
          'Pago exitoso',
          `Se ha procesado exitosamente el pago con id de la orden # ${orderId}. Nuestro bot te contactara en tu chat de Telegram para darte los links de acceso`,
          'success'
        );

        this.router.navigate([`/${UrlPagesEnum.HOME}`]);

        break;

      default:
        break;
    }
  }

  /**
   * Metodo para el boton de paypal
   *
   * @private
   * @memberof CheckoutComponent
   */
  private paypalData(): void {
    paypal
      .Buttons({
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [
              {
                description: 'Compra en OnlyGram',
                amount: {
                  currency_code: 'USD',
                  value: this.total,
                },
              },
            ],
          });
        },
        onApprove: async (data: any, actions: any) => {
          let order: any = null;

          try {
            order = await actions.order.capture();
          } catch (error) {
            this.frontLogsService.catchProcessError(
              error,
              {
                title: 'Error',
                text: 'Ha ocurrido un error en la captura de la orden',
                icon: 'error',
              },
              `file: checkout.component.ts: ~ CheckoutComponent ~ onApprove ~ JSON.stringify(error): ${JSON.stringify(
                error
              )}`
            );
          }

          if (order.status == PayPalStatusEnum.COMPLETED) {
            const timeNow: Date = new Date();
            let userId: string = localStorage.getItem(
              LocalStorageEnum.LOCAL_ID
            );
            let dataSubscriptions: Isubscriptions[] = [];
            let usd_cop: number = null;

            try {
              usd_cop = Number(
                (
                  await this.currencyConverterService
                    .getCurrencyConverter(`USD_COP`, 1)
                    .toPromise()
                ).rates.COP.rate
              );
            } catch (error) {
              this.frontLogsService.catchProcessError(
                error,
                {
                  title: 'Error',
                  text: 'Ha ocurrido un error en la conversion de la divisa',
                  icon: 'error',
                },
                `file: checkout.component.ts: ~ CheckoutComponent ~ onApprove ~ JSON.stringify(error): ${JSON.stringify(
                  error
                )}`
              );
            }

            let commission: number = await this.getCommision();

            // Se organiza la informacion de las subscripciones compradas
            for (const cart1 of this.cart) {
              let endTime: Date = functions.incrementarMeses(
                timeNow,
                cart1.infoModelSubscription.timeSubscription
              );
              let data: Isubscriptions = {
                modelId: cart1.model.id,
                userId,
                status: StatusSubscriptionsEnum.PAGADO,
                price: cart1.price,
                time: cart1.infoModelSubscription.timeSubscription,
                beginTime: timeNow.toISOString().split('T')[0],
                endTime: endTime.toISOString().split('T')[0],
                date_created: order.create_time,
                payMethod: PayMethodsEnum.PAYPAL,
                usd_cop,
                modelStatus: ModelStatusEnum.PENDIENTE_PAGO,
                commission,
              };

              dataSubscriptions.push(data);
            }

            // Se guarda la informacion de las subscripciones compradas
            let idsSubscriptions: string[] = [];
            for (const data of dataSubscriptions) {
              let res: any = null;

              try {
                res = await this.subscriptionsService.postDataFS(data);
              } catch (error) {
                this.frontLogsService.catchProcessError(
                  error,
                  {
                    title: 'Error',
                    text: 'Ha ocurrido un error guardando la subscripcion',
                    icon: 'error',
                  },
                  `file: checkout.component.ts: ~ CheckoutComponent ~ onApprove ~ JSON.stringify(error): ${JSON.stringify(
                    error
                  )}`
                );
              }

              idsSubscriptions.push(res.id);

              // Reducir la compra si esta en promocion
              await this.reducirComprasPromocion(data);
            }

            let dataOrder: Iorders = {
              date_created: new Date().toISOString(),
              ids_subscriptions: idsSubscriptions,
              userId,
              status: StatusOrdersEnum.PAGADO,
              payMethod: PayMethodsEnum.PAYPAL,
              price: this.total,
              usd_cop,
              idPay: order.id,
              currency: CurrencyEnum.USD,
            };

            let orderId: string = null;

            try {
              orderId = (await this.ordersService.postDataFS(dataOrder)).id;
            } catch (error) {
              this.frontLogsService.catchProcessError(
                error,
                {
                  title: 'Error',
                  text: 'Ha ocurrido un errorguardando la orden',
                  icon: 'error',
                },
                `file: checkout.component.ts: ~ CheckoutComponent ~ onApprove ~ JSON.stringify(error): ${JSON.stringify(
                  error
                )}`
              );
            }

            localStorage.removeItem(LocalStorageEnum.CART);
            localStorage.removeItem(LocalStorageEnum.INFO_MODEL_SUBSCRIPTION);

            let res: any = null;

            try {
              res = await this.telegramLocalService
                .getLinksOrden({ orderId })
                .toPromise();
            } catch (error) {
              this.frontLogsService.catchProcessError(
                error,
                {
                  title: 'Error',
                  text: 'Ha ocurrido un error obteniendo los links de los grupos',
                  icon: 'error',
                },
                `file: checkout.component.ts: ~ CheckoutComponent ~ onApprove ~ JSON.stringify(error): ${JSON.stringify(
                  error
                )}`
              );
            }

            alerts.basicAlert(
              'Pago exitoso',
              `Se ha procesado exitosamente el pago con id de la orden # ${orderId}. Nuestro bot te contactara en tu chat de Telegram para darte los links de acceso`,
              'success'
            );

            this.router.navigate([`/${UrlPagesEnum.HOME}`]);
          } else {
            alerts.basicAlert(
              'Pago erroneo',
              'Ha ocurrido un problema en el pago',
              'error'
            );
          }
        },
        onError: (err: any) => {
          alerts.basicAlert(
            'Pago erroneo',
            'Ha ocurrido un problema en el pago',
            'error'
          );
          console.error(err);
        },
      })
      .render(this.paypalElement.nativeElement);
  }

  /**
   * Reducir la cantidad de compras del modelo si esta en promocion
   *
   * @private
   * @param {Isubscriptions} subscripcion
   * @return {*}  {Promise<void>}
   * @memberof CheckoutComponent
   */
  private async reducirComprasPromocion(
    subscripcion: Isubscriptions
  ): Promise<void> {
    let model: Imodels = this.models.find(
      (m: Imodels) => m.id === subscripcion.modelId
    );
    let priceIndex: number = model.price.findIndex(
      (p: IpriceModel) => subscripcion.time === p.time
    );

    // Si la oferta es por cantidad de compras, se reduce la compra realizada en la promocion
    if (
      model?.price[priceIndex]?.type_limit === PriceTypeLimitEnum.SALES &&
      model?.price[priceIndex]?.sales > 0
    ) {
      try {
        let dataModelUpdate: Imodels = { ...model };
        let dataModelId: string = model.id;

        dataModelUpdate.price[priceIndex].sales--;
        delete dataModelUpdate.id;

        await this.modelsService.patchDataFS(dataModelId, dataModelUpdate);
      } catch (error) {
        this.frontLogsService.catchProcessError(
          error,
          {
            title: 'Error',
            text: 'Ha ocurrido un error actualizando el modelo',
            icon: 'error',
          },
          `file: checkout.component.ts: ~ CheckoutComponent ~ onApprove ~ JSON.stringify(error): ${JSON.stringify(
            error
          )}`
        );
      }
    }
  }

  public async getUserData(): Promise<void> {
    functions.bloquearPantalla(true);
    this.load = true;
    let qf: QueryFn = (ref) =>
      ref.where('id', '==', localStorage.getItem(LocalStorageEnum.LOCAL_ID));
    let data: IFireStoreRes[] = [];

    try {
      data = await this.userService.getDataFS(qf).toPromise();
    } catch (err) {
      this.frontLogsService.catchProcessError(
        err,
        {
          title: 'Error',
          text: 'Ha ocurrido un error en la consulta de usuarios',
          icon: 'error',
        },
        `file: checkout.component.ts: ~ CheckoutComponent ~ getUserData ~ JSON.stringify(error): ${JSON.stringify(
          err
        )}`
      );
      this.load = false;
    }

    this.user = data[0].data;
    functions.bloquearPantalla(false);
    this.load = false;
  }

  public async getCartData(): Promise<void> {
    functions.bloquearPantalla(true);
    this.load = true;

    let aux: string = localStorage.getItem(LocalStorageEnum.CART);
    if (!aux || !JSON.parse(aux) || JSON.parse(aux).length === 0) {
      this.cart = [];
      functions.bloquearPantalla(false);
      this.load = false;
      return;
    }

    this.cartLocal = JSON.parse(
      localStorage.getItem(LocalStorageEnum.CART) || ''
    );
    this.cart = [];
    this.total = 0;

    this.cartLocal.forEach(async (cartLocalItem: IInfoModelSubscription) => {
      let i: number = this.cartLocal.findIndex(
        (cart: IInfoModelSubscription) => cart == cartLocalItem
      );
      try {
        if (!cartLocalItem.idModel) {
          if (i >= 0) this.cartLocal = this.cartLocal.splice(i, 1);

          localStorage.setItem(
            LocalStorageEnum.CART,
            JSON.stringify(this.cartLocal)
          );

          alerts.basicAlert(
            'Modelo no encontrad@',
            `No se encontro el modelo`,
            'error'
          );
        } else {
          let cartItem: ICart = {};
          let model: Imodels = await new Promise((resolve) => {
            this.modelsService
              .getItemFS(cartLocalItem.idModel)
              .toPromise()
              .then(
                (res: IFireStoreRes) => {
                  let model: Imodels = res.data;
                  model.id = res.id;
                  resolve(model);
                },
                (err) => {
                  this.frontLogsService.catchProcessError(
                    err,
                    {
                      title: 'Error',
                      text: 'Ha ocurrido un error en la obtencion de la modelo',
                      icon: 'error',
                    },
                    `file: checkout.component.ts: ~ CheckoutComponent ~ getCartData ~ JSON.stringify(error): ${JSON.stringify(
                      err
                    )}`
                  );

                  this.load = false;
                  resolve(null);
                  throw err;
                }
              );
          });

          this.models.push(model);

          // Si el modelo esta activo se coloca en el carrito
          if (model.active) {
            // Verificacion de que los cupos esten disponibles

            // Item de carrito sin cupos

            let price: number | undefined = 0;

            let index: any = model.price?.findIndex(
              (price: IpriceModel) =>
                price.time == cartLocalItem.timeSubscription
            );

            if (index >= 0) {
              let priceModel: IpriceModel =
                model.price?.find(
                  (price: IpriceModel) =>
                    price.time == cartLocalItem.timeSubscription
                ) || {};

              if (priceModel != undefined) {
                let precioUnCupo: number =
                  (await this.calcularPrecio(priceModel)) || 0;

                price = precioUnCupo;
              }
            } else {
              return;
            }

            cartItem.model = model;
            cartItem.infoModelSubscription = cartLocalItem;
            cartItem.price = price;
            cartItem.detalle = `${
              cartLocalItem.timeSubscription
                ? 'Tiempo subscripcion: ' +
                  cartLocalItem.timeSubscription +
                  ' meses'
                : ''
            }`;

            this.total += cartItem.price;

            this.cart.push(cartItem);
          } else {
            if (i >= 0) this.cartLocal = this.cartLocal.splice(i, 1);

            localStorage.setItem(
              LocalStorageEnum.CART,
              JSON.stringify(this.cartLocal)
            );

            alerts.basicAlert(
              'Modelo no disponible',
              `El modelo ${model.name} no se encuentra disponible`,
              'warning'
            );
          }
        }

        functions.bloquearPantalla(false);
        this.load = false;
      } catch (error) {
        this.frontLogsService.catchProcessError(
          error,
          {
            title: 'Error',
            text: 'Ha ocurrido un error',
            icon: 'error',
          },
          `file: checkout.component.ts: ~ CheckoutComponent ~ this.cartLocal.forEach ~ JSON.stringify(error): ${JSON.stringify(
            error
          )}`
        );

        this.load = false;
      }
    });

    this.load = false;
    functions.bloquearPantalla(false);
  }

  private async calcularPrecio(price: IpriceModel): Promise<number> {
    let params: object = {
      prices: JSON.stringify([price]),
      fechaActual: new Date().toISOString(),
    };

    let preciosCalculados: number[] = [];
    try {
      preciosCalculados = (
        await this.modelsService.calcularPrecioSubscripcion(params).toPromise()
      ).preciosCalculados;
    } catch (error) {
      this.frontLogsService.catchProcessError(
        error,
        {
          title: 'Error',
          text: 'Ha ocurrido un error en la consulta de precios',
          icon: 'error',
        },
        `file: checkout.component.ts: ~ CheckoutComponent ~ calcularPrecio ~ JSON.stringify(error): ${JSON.stringify(
          error
        )}`
      );

      return undefined;
    }

    return preciosCalculados[0];
  }

  public getUrlModel(model: Imodels): string {
    return this.modelsService.getRouterLinkUrl(model);
  }

  public async eliminarCartItem(cartItem: ICart): Promise<void> {
    let result: any = await alerts.confirmAlert(
      'Eliminar item del carrito',
      '¿Esta seguro de eliminar este elemento de su carrito?',
      'warning',
      'Si'
    );

    if (!result.isConfirmed) return;

    let index: number = this.cartLocal.findIndex(
      (cartLocaItem: IInfoModelSubscription) =>
        cartLocaItem.idModel == cartItem.model?.id &&
        cartLocaItem.timeSubscription ==
          cartItem.infoModelSubscription?.timeSubscription
    );

    if (index == -1) return;

    this.cartLocal.splice(index, 1);

    localStorage.setItem(LocalStorageEnum.CART, JSON.stringify(this.cartLocal));

    this.getCartData();
  }

  public pagarPayU(): void {
    let currency: string = 'USD';
    let referenceCode: number = Math.ceil(Math.random() * 1000000);
    let firmaPayU: string = Md5.init(
      `${environment.payUCredentials.apiKey}~${environment.payUCredentials.merchantId}~${referenceCode}~${this.total}~${currency}`
    );

    let formPayU: string = `    
    <form method="post" action="${environment.payUCredentials.action}">
      <input name="merchantId"      type="hidden"  value="${environment.payUCredentials.merchantId}"   >
      <input name="accountId"       type="hidden"  value="${environment.payUCredentials.accountId.col}" >
      <input name="description"     type="hidden"  value="OnlyGram"  >
      <input name="referenceCode"   type="hidden"  value="${referenceCode}" >
      <input name="amount"          type="hidden"  value="${this.total}"   >
      <input name="tax"             type="hidden"  value="0"  >
      <input name="taxReturnBase"   type="hidden"  value="0" >
      <input name="currency"        type="hidden"  value="${currency}" >
      <input name="signature"       type="hidden"  value="${firmaPayU}"  >
      <input name="test"            type="hidden"  value="${environment.payUCredentials.test}" >
      <input name="buyerEmail"      type="hidden"  value="${this.user.email}" >
      <input name="responseUrl"     type="hidden"  value="${environment.payUCredentials.responseUrl}" >
      <input name="confirmationUrl" type="hidden"  value="${environment.payUCredentials.confirmationUrl}" >
      <input name="Submit"          type="submit"  value="Continuar"  class"btn btn-primary bg-principal p-0 px-5" id="payu-button">
    </form>  
    `;

    alerts.html('Pago por PayU', 'info', formPayU);

    let payBtn = document.querySelector('#payu-button');
    payBtn.addEventListener('click', function () {
      localStorage.setItem(
        LocalStorageEnum.PAYU_PROCESO,
        new Date().toISOString()
      );
    });
  }

  public async probarConexionBot(): Promise<void> {
    functions.bloquearPantalla(true);

    try {
      await this.telegramLocalService.probarConexionBot(this.user.chatId);
    } catch (error) {
      functions.bloquearPantalla(false);
      throw error;
    }
    functions.bloquearPantalla(false);
  }

  private async getMetodosDePago(): Promise<void> {
    let qf: QueryFn = (ref) =>
      ref.where('status', '==', EnumMetodosDePagoStatus.ACTIVE);

    let res: IFireStoreRes[] = null;
    try {
      res = await this.metodosDePagoService.getDataFS(qf).toPromise();
    } catch (error) {
      this.frontLogsService.catchProcessError(
        error,
        {
          title: 'Error',
          text: 'Ha ocurrido un error en la consulta del carrito',
          icon: 'error',
        },
        `file: checkout.component.ts: ~ CheckoutComponent ~ getMetodosDePago ~ JSON.stringify(error): ${JSON.stringify(
          error
        )}`
      );
    }

    if (!res) return null;

    this.metodosDePago = res.map((r: IFireStoreRes) => {
      return { id: r.id, ...r.data };
    });
  }

  public findMetodoDePago(metodo: PayMethodsEnum | string): boolean {
    if (!(this.metodosDePago && this.metodosDePago.length > 0)) return false;

    return this.metodosDePago.find((mp: IMetodosDePago) => mp.name === metodo)
      ? true
      : false;
  }

  public hiddenPayMethods(): boolean {
    return !(this.cart.length > 0 && this.total && this.user.chatId);
  }

  public async payEpayco(): Promise<void> {
    try {
      await this.probarConexionBot();
    } catch (error) {
      throw error;
    }

    this.tokenService.actualizarToken(
      localStorage.getItem(LocalStorageEnum.REFRESH_TOKEN)
    );

    const handler = ePayco.checkout.configure({
      key: environment.epayco.key,
      test: !environment.production,
    });
    const date: Date = new Date();
    let dateNumber: number = date.getTime();
    const dataEpayco: object = {
      name: 'OnlyGram',
      description: 'Pago de subscripciones de OnlyGram',
      invoice: dateNumber + 126351321,
      currency: 'usd',
      amount: this.total,
      tax_base: '0',
      tax: '0',
      country: this.user.country.toLowerCase(),
      lang: 'en',
      split_app_id: environment.epayco.app_id,
      split_merchant_id: environment.epayco.app_id,
      split_type: '02', // Porcentaje
      split_primary_receiver: environment.epayco.app_id,
      split_primary_receiver_fee: '0',
      splitpayment: 'true',
      split_rule: 'multiple',
      split_receivers: this.cart.map((c: ICart) => {
        return {
          id: c.model.id_epayco,
          total: c.price.toString(),
          iva: '',
          base_iva: '',
          fee: '20', // 20% comision
        };
      }),
      external: 'false',
      //Los parámetros extras deben ser enviados como un string
      // Auth token
      extra1: localStorage.getItem(LocalStorageEnum.TOKEN),
      // Date
      extra2: date,
      // Carrito
      extra3: JSON.stringify(
        this.cart.map((c: ICart) => {
          // Se envia todo menos Imodel
          return {
            infoModelSubscription: c.infoModelSubscription,
            price: c.price,
          } as ICart;
        })
      ),
      confirmation: `${environment.urlServidorLocal}/api/epayco-trans/${EnumEndpointsBack.EPAYCO.CONFIRMACION}`,
      response: `${environment.urlProd}/#/${UrlPagesEnum.HOME}`,
      //Atributos cliente
      name_billing: this.user.name,
      address_billing: '',
      type_doc_billing: this.user.document_type,
      mobilephone_billing: this.user.celphone.toString(),
      number_doc_billing: this.user.document_value,
    };

    handler.open(dataEpayco);
  }

  private alertPage(): void {
    this.alertsPagesService
      .alertPage(EnumPages.CHECKOUT)
      .toPromise()
      .then((res: any) => {});
  }
}
