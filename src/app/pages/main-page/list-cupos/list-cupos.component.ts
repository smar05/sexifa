import { Irifas } from './../../../interface/irifas';
import { RifasService } from './../../../services/rifas.service';
import { ActivatedRoute } from '@angular/router';
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
  public modelSubscriptionPrice: number = 1;

  constructor(
    private activatedRoute: ActivatedRoute,
    private rifaService: RifasService
  ) {}

  async ngOnInit(): Promise<void> {
    //Id de la rifa
    this.rifaId = this.activatedRoute.snapshot.paramMap.get('id') || '';
    await this.getRifa();
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
}
