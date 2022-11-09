import { alerts } from './../../../helpers/alerts';
import { IpriceModel } from './../../../interface/iprice-model';
import { IInfoModelSubscription } from './../../../interface/i-info-model-subscription';
import { Imodels } from './../../../interface/imodels';
import { ModelsService } from './../../../services/models.service';
import { Irifas, StateRifas } from './../../../interface/irifas';
import { RifasService } from './../../../services/rifas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Icupo, StateCupo } from './../../../interface/icupo';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-cupos',
  templateUrl: './list-cupos.component.html',
  styleUrls: ['./list-cupos.component.css'],
})
export class ListCuposComponent implements OnInit {
  public rifa!: Irifas;
  public rifaId: string = '';
  public modelSubscriptionPrice!: number;
  public modelForRifa!: Imodels;
  public cuposSeleccionadosEnPagina: Icupo[] = [];
  public cuposSeleccionadosModeloActual: number[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private rifaService: RifasService,
    private modelsService: ModelsService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    //Id de la rifa
    this.rifaId = this.activatedRoute.snapshot.paramMap.get('id') || '';
    await this.getRifa();
    await this.getInfoForSubscription();
  }

  public async getRifa(): Promise<void> {
    this.rifa = await this.rifaService.getItem(this.rifaId).toPromise();

    // Se asigna el id de los cupos de la rifa
    this.rifa.listCupos = Object.keys(this.rifa.listCupos).map((a: any) => {
      this.rifa.listCupos[a].id = a;
      return this.rifa.listCupos[a];
    });

    // Si existe carrito
    if (localStorage.getItem('cart')) {
      let cart: IInfoModelSubscription[] = JSON.parse(
        localStorage.getItem('cart') || ''
      );
      let infoModelSubscription: IInfoModelSubscription = JSON.parse(
        localStorage.getItem('infoModelSubscription') || ''
      );
      let cuposSeleccionadosEnCarrito: number[] = [];
      this.cuposSeleccionadosModeloActual = [];

      // Obtenemos los cupos que ya selecciono el usuario en su carrito
      cart.forEach((infoModelSubcription: IInfoModelSubscription) => {
        if (infoModelSubcription.cupos) {
          cuposSeleccionadosEnCarrito.push(...infoModelSubcription.cupos);

          if (
            infoModelSubcription.idModel == infoModelSubscription.idModel &&
            infoModelSubcription.timeSubscription ==
              infoModelSubscription.timeSubscription
          ) {
            this.cuposSeleccionadosModeloActual.push(
              ...infoModelSubcription.cupos
            );
          }
        }
      });

      let cupoEncontradoIndex: number;
      let cuposVendidosYEnCarrito: number[] = [];

      cuposSeleccionadosEnCarrito.forEach((cupoId: number) => {
        cupoEncontradoIndex = this.rifa.listCupos.findIndex(
          (cupo: Icupo) => cupo.id == cupoId
        );

        // Seleccionamos los cupos que ya selecciono el usuario, al menos que ya esten vendidos
        if (cupoEncontradoIndex >= 0) {
          // Si los cupos ya fueron vendidos, los eliminamos del carrito
          if (
            this.rifa.listCupos[cupoEncontradoIndex].state == StateCupo.SOLD
          ) {
            cuposVendidosYEnCarrito.push(cupoId);
          } else {
            this.rifa.listCupos[cupoEncontradoIndex].state = StateCupo.SELECT;

            if (
              this.cuposSeleccionadosModeloActual.findIndex(
                (cupoN: number) => cupoN == cupoId
              ) >= 0
            ) {
              this.cuposSeleccionadosEnPagina.push(
                this.rifa.listCupos[cupoEncontradoIndex]
              );
            }
          }
        }
      });

      // Si los cupos ya fueron vendidos, los eliminamos del carrito
      if (cuposVendidosYEnCarrito.length > 0) {
        cart.forEach((infoModelSubcription: IInfoModelSubscription) => {
          cuposVendidosYEnCarrito.forEach((cupoId: number) => {
            let index: number | undefined =
              infoModelSubcription.cupos?.findIndex(
                (cupoCart: number) => cupoCart == cupoId
              );
            if (index != undefined && index >= 0)
              infoModelSubcription.cupos?.splice(index, 1); // Lo eliminamos del carrito
          });
        });

        localStorage.setItem('cart', JSON.stringify(cart));
      }
    }
  }

  public changeCupoState(cupo: Icupo): void {
    let index: number = this.rifa.listCupos?.findIndex(
      (cupoLocal: Icupo) => cupoLocal.id == cupo.id
    );

    if (index == -1) return;

    if (cupo.state == StateCupo.AVAILABLE) {
      this.rifa.listCupos[index].state = StateCupo.SELECT;
      this.cuposSeleccionadosEnPagina.push(this.rifa.listCupos[index]);
      this.cuposSeleccionadosModeloActual.push(
        this.rifa.listCupos[index].id || NaN
      );
    } else {
      this.rifa.listCupos[index].state = StateCupo.AVAILABLE;
      let i: number = this.cuposSeleccionadosEnPagina.findIndex(
        (cupoS: Icupo) => cupoS.id == cupo.id
      );
      let i2: number = this.cuposSeleccionadosModeloActual.findIndex(
        (cupoS: number) => cupoS == cupo.id
      );
      this.cuposSeleccionadosEnPagina.splice(i, 1);
      this.cuposSeleccionadosModeloActual.splice(i2, 1);
    }
  }

  public async getInfoForSubscription(): Promise<void> {
    if (this.rifa.state == StateRifas.ACTIVE) {
      //Para las rifas activas
      let { idModel, timeSubscription } = JSON.parse(
        localStorage.getItem('infoModelSubscription') || ''
      );

      if (idModel && timeSubscription) {
        try {
          this.modelForRifa = await this.modelsService
            .getItem(idModel)
            .toPromise();

          let priceModel: IpriceModel =
            this.modelForRifa.price?.find(
              (price: IpriceModel) => price.time == timeSubscription
            ) || {};

          this.modelSubscriptionPrice =
            this.modelsService.calculoPrecioSubscripcion(priceModel) || 0;

          if (this.modelSubscriptionPrice <= 0) {
            alerts.basicAlert(
              'Error',
              'Ha ocurrido un error, por favor seleccione un model@',
              'error'
            );
            this.router.navigateByUrl('/');
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        alerts.basicAlert(
          'Error',
          'Primero debe seleccionar al model@ y el tiempo de subscripcion por el cual quieres participar',
          'error'
        );
        this.router.navigateByUrl('/');
      }
    }
  }

  public comprar(): void {
    let cart: IInfoModelSubscription[] = localStorage.getItem('cart')
      ? JSON.parse(localStorage.getItem('cart') || '')
      : [];
    let infoModelSubscriptionLocal: IInfoModelSubscription =
      localStorage.getItem('infoModelSubscription')
        ? JSON.parse(localStorage.getItem('infoModelSubscription') || '')
        : {};

    let cuposSeleccionadosIds: number[] = [];

    //Cupos seleccionados por el usuario
    this.cuposSeleccionadosEnPagina.forEach((cupo: Icupo) => {
      if (cupo.id) cuposSeleccionadosIds.push(cupo.id);
    });

    // Miramos si ya existe en el carrito
    let modelInfoSubscriptionIndex: number = cart.findIndex(
      (infoModelSubscription: IInfoModelSubscription) =>
        infoModelSubscription.idModel == infoModelSubscriptionLocal.idModel &&
        infoModelSubscription.timeSubscription ==
          infoModelSubscriptionLocal.timeSubscription
    );

    // Si existe en el carrito
    if (modelInfoSubscriptionIndex >= 0) {
      cart[modelInfoSubscriptionIndex].cupos = cuposSeleccionadosIds;
    } else {
      infoModelSubscriptionLocal.cupos = cuposSeleccionadosIds;
      cart.push(infoModelSubscriptionLocal);
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    this.router.navigateByUrl('/checkout');
  }

  public disabledPorSerDeOtroModelo(cupo: Icupo): boolean {
    // Si el cupo es del modelo actual se habilita
    return !(
      this.cuposSeleccionadosModeloActual.findIndex(
        (cupoId: number) => cupoId == cupo.id
      ) >= 0
    );
  }
}
