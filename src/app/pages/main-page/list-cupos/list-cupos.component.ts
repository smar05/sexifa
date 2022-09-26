import { IpriceModel } from './../../../interface/iprice-model';
import { Imodels } from './../../../interface/imodels';
import { ModelsService } from './../../../services/models.service';
import { alerts } from 'src/app/helpers/alerts';
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
  public totalPrice: number = 0;
  public modelSubscriptionPrice!: number;
  public modelForRifa!: Imodels;

  constructor(
    private activatedRoute: ActivatedRoute,
    private rifaService: RifasService,
    private router: Router,
    private modelsService: ModelsService
  ) {}

  async ngOnInit(): Promise<void> {
    //Id de la rifa
    this.rifaId = this.activatedRoute.snapshot.paramMap.get('id') || '';
    await this.getRifa();
    await this.getInfoForSubscription();
  }

  public async getRifa(): Promise<void> {
    this.rifa = await this.rifaService.getItem(this.rifaId).toPromise();
  }

  public changeCupoState(cupo: Icupo): void {
    let index: number = this.rifa.listCupos?.findIndex(
      (cupoLocal: Icupo) => cupoLocal.id == cupo.id
    );

    if (index == -1) return;

    if (cupo.state == StateCupo.AVAILABLE) {
      this.rifa.listCupos[index].state = StateCupo.SELECT;
      this.totalPrice += this.modelSubscriptionPrice;
    } else {
      this.rifa.listCupos[index].state = StateCupo.AVAILABLE;
      this.totalPrice -= this.modelSubscriptionPrice;
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
            this.calculoPrecioSubscripcion(priceModel) || 0;

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

  public calculoPrecioSubscripcion(price: IpriceModel): number | undefined {
    if (price?.price && price?.percentage) {
      return Math.floor(price.price * (price.percentage / 100) * 100) / 100;
    }

    return undefined;
  }
}
