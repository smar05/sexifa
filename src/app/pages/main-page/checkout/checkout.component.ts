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
import { IFrontLogs } from 'src/app/interface/i-front-logs';
import { FrontLogsService } from 'src/app/services/front-logs.service';

declare var paypal: any;

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
  public user: Iuser = {};
  public cartLocal: IInfoModelSubscription[] = []; // Carrito de localstorage en local
  public cart: ICart[] = []; // Objeto que se muestra en pantalla
  public total: number = 0;
  public payMethod!: string;
  public load: boolean = false;
  public models: Imodels[] = [];

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
    private frontLogsService: FrontLogsService
  ) {}

  async ngOnInit(): Promise<void> {
    functions.bloquearPantalla(true);
    this.getUserData();

    try {
      await this.getCartData();
    } catch (error) {
      console.error('Error: ', error);
      alerts.basicAlert(
        'Error',
        'Ha ocurrido un error en la consulta del carrito',
        'error'
      );

      let data: IFrontLogs = {
        date: new Date(),
        userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
        log: `file: checkout.component.ts: ~ CheckoutComponent ~ ngOnInit ~ JSON.stringify(error): ${JSON.stringify(
          error
        )}`,
      };

      this.frontLogsService
        .postDataFS(data)
        .then((res) => {})
        .catch((err) => {
          alerts.basicAlert('Error', 'Error', 'error');
        });
    }

    console.log(
      '🚀 ~ file: checkout.component.ts:74 ~ CheckoutComponent ~ ngOnInit ~ this.cart:',
      this.cart
    );

    try {
      await this.ifPayU();
    } catch (error) {
      console.error('Error: ', error);
      alerts.basicAlert(
        'Error',
        'Ha ocurrido un error con el metodo PayU',
        'error'
      );

      let data: IFrontLogs = {
        date: new Date(),
        userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
        log: `file: checkout.component.ts: ~ CheckoutComponent ~ ngOnInit ~ JSON.stringify(error): ${JSON.stringify(
          error
        )}`,
      };

      this.frontLogsService
        .postDataFS(data)
        .then((res) => {})
        .catch((err) => {
          alerts.basicAlert('Error', 'Error', 'error');
        });
    }

    this.paypalData();
    functions.bloquearPantalla(false);
  }

  /**
   * Consulta si el pago se hizo por PayU
   *
   * @private
   * @return {*}  {Promise<void>}
   * @memberof CheckoutComponent
   */
  private async ifPayU(): Promise<void> {
    console.log(
      '🚀 ~ file: checkout.component.ts:85 ~ CheckoutComponent ~ ifPayU ~ this.cart:',
      this.cart
    );
    let params: QParamsPayU = this.activatedRoute.snapshot.queryParams as any;

    let payProceso: Date = new Date(
      localStorage.getItem(LocalStorageEnum.PAYU_PROCESO) || ''
    );

    localStorage.removeItem(LocalStorageEnum.PAYU_PROCESO);
    if (params.transactionState && payProceso < new Date()) {
      try {
        await this.payUProcess(params);
      } catch (error) {
        console.error('Error: ', error);
        alerts.basicAlert(
          'Error',
          'Ha ocurrido un error con el proceso de PayU',
          'error'
        );

        let data: IFrontLogs = {
          date: new Date(),
          userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
          log: `file: checkout.component.ts: ~ CheckoutComponent ~ ifPayU ~ JSON.stringify(error): ${JSON.stringify(
            error
          )}`,
        };

        this.frontLogsService
          .postDataFS(data)
          .then((res) => {})
          .catch((err) => {
            alerts.basicAlert('Error', 'Error', 'error');
          });
      }
    }
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
      console.error('Error: ', error);
      alerts.basicAlert(
        'Error',
        'Ha ocurrido un error en la conversion de la moneda',
        'error'
      );

      let data: IFrontLogs = {
        date: new Date(),
        userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
        log: `file: checkout.component.ts: ~ CheckoutComponent ~ payUProcess ~ JSON.stringify(error): ${JSON.stringify(
          error
        )}`,
      };

      this.frontLogsService
        .postDataFS(data)
        .then((res) => {})
        .catch((err) => {
          alerts.basicAlert('Error', 'Error', 'error');
        });
    }

    let dataSubscriptions: Isubscriptions[] = [];

    switch (params.transactionState) {
      // APPROVED
      case '4':
        console.log(
          '🚀 ~ file: checkout.component.ts:101 ~ CheckoutComponent ~ payUProcess ~ this.cart:',
          this.cart[0]
        );
        // Se organiza la informacion de las subscripciones compradas
        for (const cart1 of this.cart) {
          console.log(
            '🚀 ~ file: checkout.component.ts:119 ~ CheckoutComponent ~ payUProcess ~ cart1:',
            cart1
          );

          let endTime: Date = functions.incrementarMeses(
            timeNow,
            cart1.infoModelSubscription.timeSubscription
          );
          console.log('AAAAAAAAAA');

          let data: Isubscriptions = {
            modelId: cart1.model.id,
            userId,
            status: StatusSubscriptionsEnum.PAGADO,
            price: cart1.price,
            time: cart1.infoModelSubscription.timeSubscription,
            beginTime: timeNow.toISOString().split('T')[0],
            endTime: endTime.toISOString().split('T')[0],
            date_created: params.processingDate,
            payMethod: PayMethodsEnum.PAYU,
            usd_cop,
            modelStatus: ModelStatusEnum.PENDIENTE_PAGO,
          };
          console.log(
            '🚀 ~ file: checkout.component.ts:136 ~ CheckoutComponent ~ payUProcess ~ data:',
            data
          );

          dataSubscriptions.push(data);
        }

        console.log(
          '🚀 ~ file: checkout.component.ts:139 ~ CheckoutComponent ~ payUProcess ~ dataSubscriptions:',
          dataSubscriptions
        );

        // Se guarda la informacion de las subscripciones compradas
        let idsSubscriptions: string[] = [];
        for (const data of dataSubscriptions) {
          let res: any = null;

          try {
            res = await this.subscriptionsService.postDataFS(data);
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
              log: `file: checkout.component.ts: ~ CheckoutComponent ~ payUProcess ~ JSON.stringify(error): ${JSON.stringify(
                error
              )}`,
            };

            this.frontLogsService
              .postDataFS(data)
              .then((res) => {})
              .catch((err) => {
                alerts.basicAlert('Error', 'Error', 'error');
              });
          }

          console.log(
            '🚀 ~ file: checkout.component.ts:130 ~ CheckoutComponent ~ payUProcess ~ res:',
            res
          );

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
          console.error('Error: ', error);
          alerts.basicAlert(
            'Error',
            'Ha ocurrido un error al guardar la orden',
            'error'
          );

          let data: IFrontLogs = {
            date: new Date(),
            userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
            log: `file: checkout.component.ts: ~ CheckoutComponent ~ payUProcess ~ JSON.stringify(error): ${JSON.stringify(
              error
            )}`,
          };

          this.frontLogsService
            .postDataFS(data)
            .then((res) => {})
            .catch((err) => {
              alerts.basicAlert('Error', 'Error', 'error');
            });
        }

        localStorage.removeItem(LocalStorageEnum.CART);
        localStorage.removeItem(LocalStorageEnum.INFO_MODEL_SUBSCRIPTION);

        let res: any = null;

        try {
          res = await this.telegramLocalService
            .getLinksOrden({ orderId })
            .toPromise();
        } catch (error) {
          console.error('Error: ', error);
          alerts.basicAlert(
            'Error',
            'Ha ocurrido un error en la obtencion de los links de los grupos',
            'error'
          );

          let data: IFrontLogs = {
            date: new Date(),
            userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
            log: `file: checkout.component.ts: ~ CheckoutComponent ~ payUProcess ~ JSON.stringify(error): ${JSON.stringify(
              error
            )}`,
          };

          this.frontLogsService
            .postDataFS(data)
            .then((res) => {})
            .catch((err) => {
              alerts.basicAlert('Error', 'Error', 'error');
            });
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
            console.error('Error: ', error);
            alerts.basicAlert(
              'Error',
              'Ha ocurrido un error en la captura de la orden',
              'error'
            );

            let data: IFrontLogs = {
              date: new Date(),
              userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
              log: `file: checkout.component.ts: ~ CheckoutComponent ~ onApprove ~ JSON.stringify(error): ${JSON.stringify(
                error
              )}`,
            };

            this.frontLogsService
              .postDataFS(data)
              .then((res) => {})
              .catch((err) => {
                alerts.basicAlert('Error', 'Error', 'error');
              });
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
              console.error('Error: ', error);
              alerts.basicAlert(
                'Error',
                'Ha ocurrido un error en la conversion de la divisa',
                'error'
              );

              let data: IFrontLogs = {
                date: new Date(),
                userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
                log: `file: checkout.component.ts: ~ CheckoutComponent ~ onApprove ~ JSON.stringify(error): ${JSON.stringify(
                  error
                )}`,
              };

              this.frontLogsService
                .postDataFS(data)
                .then((res) => {})
                .catch((err) => {
                  alerts.basicAlert('Error', 'Error', 'error');
                });
            }

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
                console.error('Error: ', error);
                alerts.basicAlert(
                  'Error',
                  'Ha ocurrido un error guardando la subscripcion',
                  'error'
                );

                let data: IFrontLogs = {
                  date: new Date(),
                  userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
                  log: `file: checkout.component.ts: ~ CheckoutComponent ~ onApprove ~ JSON.stringify(error): ${JSON.stringify(
                    error
                  )}`,
                };

                this.frontLogsService
                  .postDataFS(data)
                  .then((res) => {})
                  .catch((err) => {
                    alerts.basicAlert('Error', 'Error', 'error');
                  });
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
              console.error('Error: ', error);
              alerts.basicAlert(
                'Error',
                'Ha ocurrido un errorguardando la orden',
                'error'
              );

              let data: IFrontLogs = {
                date: new Date(),
                userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
                log: `file: checkout.component.ts: ~ CheckoutComponent ~ onApprove ~ JSON.stringify(error): ${JSON.stringify(
                  error
                )}`,
              };

              this.frontLogsService
                .postDataFS(data)
                .then((res) => {})
                .catch((err) => {
                  alerts.basicAlert('Error', 'Error', 'error');
                });
            }

            localStorage.removeItem(LocalStorageEnum.CART);
            localStorage.removeItem(LocalStorageEnum.INFO_MODEL_SUBSCRIPTION);

            let res: any = null;

            try {
              res = await this.telegramLocalService
                .getLinksOrden({ orderId })
                .toPromise();
            } catch (error) {
              console.error('Error: ', error);
              alerts.basicAlert(
                'Error',
                'Ha ocurrido un error obteniendo los links de los grupos',
                'error'
              );

              let data: IFrontLogs = {
                date: new Date(),
                userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
                log: `file: checkout.component.ts: ~ CheckoutComponent ~ onApprove ~ JSON.stringify(error): ${JSON.stringify(
                  error
                )}`,
              };

              this.frontLogsService
                .postDataFS(data)
                .then((res) => {})
                .catch((err) => {
                  alerts.basicAlert('Error', 'Error', 'error');
                });
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
        console.error('Error: ', error);
        alerts.basicAlert(
          'Error',
          'Ha ocurrido un error actualizando el modelo',
          'error'
        );

        let data: IFrontLogs = {
          date: new Date(),
          userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
          log: `file: checkout.component.ts: ~ CheckoutComponent ~ onApprove ~ JSON.stringify(error): ${JSON.stringify(
            error
          )}`,
        };

        this.frontLogsService
          .postDataFS(data)
          .then((res) => {})
          .catch((err) => {
            alerts.basicAlert('Error', 'Error', 'error');
          });
      }
    }
  }

  public getUserData(): void {
    functions.bloquearPantalla(true);
    this.load = true;
    let qf: QueryFn = (ref) =>
      ref.where('id', '==', localStorage.getItem(LocalStorageEnum.LOCAL_ID));
    this.userService
      .getDataFS(qf)
      .toPromise()
      .then(
        (data: IFireStoreRes[]) => {
          this.user = data[0].data;
          functions.bloquearPantalla(false);
          this.load = false;
        },
        (err: any) => {
          alerts.basicAlert(
            'Error',
            'Ha ocurrido un error en la consulta de usuarios',
            'error'
          );

          let data: IFrontLogs = {
            date: new Date(),
            userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
            log: `file: checkout.component.ts: ~ CheckoutComponent ~ getUserData ~ JSON.stringify(error): ${JSON.stringify(
              err
            )}`,
          };

          this.frontLogsService
            .postDataFS(data)
            .then((res) => {})
            .catch((err) => {
              alerts.basicAlert('Error', 'Error', 'error');
            });

          functions.bloquearPantalla(false);
          this.load = false;
        }
      );
  }

  public async getCartData(): Promise<void> {
    functions.bloquearPantalla(true);
    this.load = true;

    if (!localStorage.getItem(LocalStorageEnum.CART)) return;

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
                  console.error(err);
                  alerts.basicAlert(
                    'Error',
                    'Ha ocurrido un error en la obtencion de la modelo',
                    'error'
                  );

                  let data: IFrontLogs = {
                    date: new Date(),
                    userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
                    log: `file: checkout.component.ts: ~ CheckoutComponent ~ getCartData ~ JSON.stringify(error): ${JSON.stringify(
                      err
                    )}`,
                  };

                  this.frontLogsService
                    .postDataFS(data)
                    .then((res) => {})
                    .catch((err) => {
                      alerts.basicAlert('Error', 'Error', 'error');
                    });

                  resolve(null);
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

              if (
                this.modelsService.calculoPrecioSubscripcion(priceModel) !=
                undefined
              ) {
                let precioUnCupo: number =
                  this.modelsService.calculoPrecioSubscripcion(priceModel) || 0;

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
        console.error('Error: ', error);

        let data: IFrontLogs = {
          date: new Date(),
          userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
          log: `file: checkout.component.ts: ~ CheckoutComponent ~ this.cartLocal.forEach ~ JSON.stringify(error): ${JSON.stringify(
            error
          )}`,
        };

        this.frontLogsService
          .postDataFS(data)
          .then((res) => {})
          .catch((err) => {
            alerts.basicAlert('Error', 'Error', 'error');
          });

        functions.bloquearPantalla(false);
        this.load = false;
        throw error;
      }
    });
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

  public probarConexionBot(): void {
    this.telegramLocalService.probarConexionBot(this.user.chatId);
  }
}
