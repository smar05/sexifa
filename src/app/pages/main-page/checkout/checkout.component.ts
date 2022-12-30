import { Icupo, StateCupoEnum } from './../../../interface/icupo';
import { UrlPagesEnum } from './../../../enum/urlPagesEnum';
import { StateRifasEnum, Irifas } from './../../../interface/irifas';
import { Router } from '@angular/router';
import { IpriceModel } from './../../../interface/iprice-model';
import { Imodels } from './../../../interface/imodels';
import { ModelsService } from './../../../services/models.service';
import { IInfoModelSubscription } from './../../../interface/i-info-model-subscription';
import { Iuser } from './../../../interface/iuser';
import { IQueryParams } from './../../../interface/i-query-params';
import { UserService } from './../../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { ICart } from 'src/app/interface/i-cart';
import { LocalStorageEnum } from 'src/app/enum/localStorageEnum';
import { alerts } from 'src/app/helpers/alerts';
import { RifasService } from 'src/app/services/rifas.service';

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
  public rifa!: Irifas;

  constructor(
    private userService: UserService,
    private modelsService: ModelsService,
    private rifasService: RifasService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.getUserData();
    await this.getRifa();
    await this.getCartData();
  }

  public getUserData(): void {
    let params: IQueryParams = {
      orderBy: '"id"',
      equalTo: `"${localStorage.getItem(LocalStorageEnum.LOCAL_ID)}"`,
    };
    this.userService
      .getData(params)
      .toPromise()
      .then((data: any) => {
        this.user = Object.keys(data).map((a: any) => {
          return data[a];
        })[0];
      });
  }

  public async getCartData(): Promise<void> {
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
          let model: Imodels = await this.modelsService
            .getItem(cartLocalItem.idModel)
            .toPromise();

          // Si el modelo esta activo se coloca en el carrito
          if (model.active) {
            // Verificacion de que los cupos esten disponibles
            cartLocalItem.cupos?.forEach((numeroCupo: number) => {
              let cupo: Icupo | undefined = this.rifa.listCupos.find(
                (cupo: Icupo) => cupo.id == numeroCupo
              );

              if (cupo && cupo.state == StateCupoEnum.SOLD) {
                cartLocalItem.cupos = cartLocalItem.cupos?.filter(
                  (cupoN: number) => cupoN != numeroCupo
                );

                localStorage.setItem(
                  LocalStorageEnum.CART,
                  JSON.stringify(this.cartLocal)
                );

                alerts.basicAlert(
                  'Cupo no disponible',
                  `El cupo ${cupo.id} no se encuentra disponible`,
                  'error'
                );
              }
            });

            // Item de carrito sin cupos
            if (cartLocalItem.cupos?.length == 0) {
              this.cartLocal = this.cartLocal.filter(
                (itemCart: IInfoModelSubscription) =>
                  itemCart.idModel != cartLocalItem.idModel
              );

              this.cart = this.cart.filter(
                (itemCart: ICart) => itemCart.model?.id != cartLocalItem.idModel
              );

              localStorage.setItem(
                LocalStorageEnum.CART,
                JSON.stringify(this.cartLocal)
              );

              return;
            }

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
                  undefined &&
                cartLocalItem.cupos
              ) {
                let precioUnCupo: number =
                  this.modelsService.calculoPrecioSubscripcion(priceModel) || 0;
                let cantidadCupos: number = cartLocalItem.cupos.length;

                price = precioUnCupo * cantidadCupos;
              }
            } else {
              return;
            }

            cartItem.model = model;
            cartItem.infoModelSubscription = cartLocalItem;
            cartItem.price = price;
            cartItem.detalle = `${
              cartLocalItem.timeSubscription
                ? 'Tiempo subscripcion: ' + cartLocalItem.timeSubscription
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
      } catch (error) {
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

  public async editarCartItem(cartItem: ICart): Promise<void> {
    localStorage.setItem(
      LocalStorageEnum.INFO_MODEL_SUBSCRIPTION,
      JSON.stringify(cartItem.infoModelSubscription)
    );

    let params: IQueryParams = {
      orderBy: '"state"',
      equalTo: `"${StateRifasEnum.ACTIVE}"`,
    };

    try {
      let rifa: Irifas = await this.rifasService.getData(params).toPromise();
      let idRifa: string = Object.keys(rifa)[0];

      this.router.navigateByUrl(`/${UrlPagesEnum.RIFA}/${idRifa}`);
    } catch (error) {
      console.error(error);
    }
  }

  public async getRifa(): Promise<void> {
    let params: IQueryParams = {
      orderBy: '"state"',
      equalTo: `"${StateRifasEnum.ACTIVE}"`,
    };
    this.rifa = (await this.rifasService.getData(params).toPromise())[0];

    // Se asigna el id de los cupos de la rifa
    this.rifa.listCupos = Object.keys(this.rifa.listCupos).map((a: any) => {
      this.rifa.listCupos[a].id = a;
      return this.rifa.listCupos[a];
    });
  }
}
