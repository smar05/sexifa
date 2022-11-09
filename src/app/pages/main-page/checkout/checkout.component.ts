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

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  public user: Iuser = {};
  public cartLocal: IInfoModelSubscription[] = [];
  public cart: ICart[] = [];
  public total: number = 0;

  constructor(
    private userService: UserService,
    private modelsService: ModelsService
  ) {}

  ngOnInit(): void {
    this.getUserData();
    this.getCartData();
  }

  public getUserData(): void {
    let params: IQueryParams = {
      orderBy: '"id"',
      equalTo: `"${localStorage.getItem(LocalStorageEnum.LOCAL_ID)}"`,
    };
    this.userService.getData(params).subscribe((data: any) => {
      this.user = Object.keys(data).map((a: any) => {
        return data[a];
      })[0];
    });
  }

  public getCartData(): void {
    this.cartLocal = JSON.parse(
      localStorage.getItem(LocalStorageEnum.CART) || ''
    );
    this.cart = [];
    this.total = 0;

    if (!this.cartLocal) return;

    this.cartLocal.forEach(async (cartLocalItem: IInfoModelSubscription) => {
      try {
        if (!cartLocalItem.idModel) return;
        let cartItem: ICart = {};
        let model: Imodels = await this.modelsService
          .getItem(cartLocalItem.idModel)
          .toPromise();
        let price: number | undefined = 0;

        let index: any = model.price?.findIndex(
          (price: IpriceModel) => price.time == cartLocalItem.timeSubscription
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
}
