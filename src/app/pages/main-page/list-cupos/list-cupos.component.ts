import { Icupo, StateCupo } from './../../../interface/icupo';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-cupos',
  templateUrl: './list-cupos.component.html',
  styleUrls: ['./list-cupos.component.css'],
})
export class ListCuposComponent implements OnInit {
  public totalPrice: number = 0;
  public modelSubscriptionPrice: number = 1;
  public cuposTodos: Icupo[] = [
    {
      id: 1,
      idUser: '',
      state: StateCupo.AVAILABLE,
    },
    {
      id: 2,
      idUser: '',
      state: StateCupo.SOLD,
    },
    {
      id: 3,
      idUser: '',
      state: StateCupo.SOLD,
    },
    {
      id: 4,
      idUser: '',
      state: StateCupo.AVAILABLE,
    },
    {
      id: 5,
      idUser: '',
      state: StateCupo.AVAILABLE,
    },
    {
      id: 6,
      idUser: '',
      state: StateCupo.SOLD,
    },
    {
      id: 7,
      idUser: '',
      state: StateCupo.AVAILABLE,
    },
    {
      id: 8,
      idUser: '',
      state: StateCupo.AVAILABLE,
    },
    {
      id: 9,
      idUser: '',
      state: StateCupo.AVAILABLE,
    },
    {
      id: 10,
      idUser: '',
      state: StateCupo.AVAILABLE,
    },
    {
      id: 11,
      idUser: '',
      state: StateCupo.AVAILABLE,
    },
    {
      id: 12,
      idUser: '',
      state: StateCupo.AVAILABLE,
    },
    {
      id: 13,
      idUser: '',
      state: StateCupo.AVAILABLE,
    },
    {
      id: 14,
      idUser: '',
      state: StateCupo.AVAILABLE,
    },
    {
      id: 15,
      idUser: '',
      state: StateCupo.AVAILABLE,
    },
    {
      id: 16,
      idUser: '',
      state: StateCupo.AVAILABLE,
    },
    {
      id: 17,
      idUser: '',
      state: StateCupo.AVAILABLE,
    },
    {
      id: 18,
      idUser: '',
      state: StateCupo.AVAILABLE,
    },
    {
      id: 19,
      idUser: '',
      state: StateCupo.AVAILABLE,
    },
    {
      id: 20,
      idUser: '',
      state: StateCupo.AVAILABLE,
    },
    {
      id: 21,
      idUser: '',
      state: StateCupo.AVAILABLE,
    },
    {
      id: 22,
      idUser: '',
      state: StateCupo.AVAILABLE,
    },
    {
      id: 23,
      idUser: '',
      state: StateCupo.AVAILABLE,
    },
    {
      id: 24,
      idUser: '',
      state: StateCupo.AVAILABLE,
    },
    {
      id: 25,
      idUser: '',
      state: StateCupo.AVAILABLE,
    },
    {
      id: 26,
      idUser: '',
      state: StateCupo.AVAILABLE,
    },
    {
      id: 27,
      idUser: '',
      state: StateCupo.AVAILABLE,
    },
    {
      id: 28,
      idUser: '',
      state: StateCupo.AVAILABLE,
    },
    {
      id: 29,
      idUser: '',
      state: StateCupo.AVAILABLE,
    },
    {
      id: 30,
      idUser: '',
      state: StateCupo.AVAILABLE,
    },
    {
      id: 31,
      idUser: '',
      state: StateCupo.AVAILABLE,
    },
    {
      id: 32,
      idUser: '',
      state: StateCupo.AVAILABLE,
    },
    {
      id: 33,
      idUser: '',
      state: StateCupo.AVAILABLE,
    },
    {
      id: 34,
      idUser: '',
      state: StateCupo.AVAILABLE,
    },
    {
      id: 35,
      idUser: '',
      state: StateCupo.AVAILABLE,
    },
    {
      id: 36,
      idUser: '',
      state: StateCupo.AVAILABLE,
    },
    {
      id: 37,
      idUser: '',
      state: StateCupo.AVAILABLE,
    },
    {
      id: 38,
      idUser: '',
      state: StateCupo.AVAILABLE,
    },
    {
      id: 39,
      idUser: '',
      state: StateCupo.AVAILABLE,
    },
    {
      id: 40,
      idUser: '',
      state: StateCupo.AVAILABLE,
    },
    { id: 41, idUser: '', state: StateCupo.AVAILABLE },
    { id: 42, idUser: '', state: StateCupo.AVAILABLE },
    { id: 43, idUser: '', state: StateCupo.AVAILABLE },
    { id: 44, idUser: '', state: StateCupo.AVAILABLE },
    { id: 45, idUser: '', state: StateCupo.AVAILABLE },
    { id: 46, idUser: '', state: StateCupo.AVAILABLE },
    { id: 47, idUser: '', state: StateCupo.AVAILABLE },
    { id: 48, idUser: '', state: StateCupo.AVAILABLE },
    { id: 49, idUser: '', state: StateCupo.AVAILABLE },
    { id: 50, idUser: '', state: StateCupo.AVAILABLE },
    { id: 51, idUser: '', state: StateCupo.AVAILABLE },
    {
      id: 52,
      idUser: '',
      state: StateCupo.AVAILABLE,
    },
    { id: 53, idUser: '', state: StateCupo.AVAILABLE },
    { id: 54, idUser: '', state: StateCupo.AVAILABLE },
    { id: 55, idUser: '', state: StateCupo.AVAILABLE },
    { id: 56, idUser: '', state: StateCupo.AVAILABLE },
    { id: 57, idUser: '', state: StateCupo.AVAILABLE },
    { id: 58, idUser: '', state: StateCupo.AVAILABLE },
    { id: 59, idUser: '', state: StateCupo.AVAILABLE },
    { id: 60, idUser: '', state: StateCupo.AVAILABLE },
    { id: 61, idUser: '', state: StateCupo.AVAILABLE },
    { id: 62, idUser: '', state: StateCupo.AVAILABLE },
    { id: 63, idUser: '', state: StateCupo.AVAILABLE },
    { id: 64, idUser: '', state: StateCupo.AVAILABLE },
    { id: 65, idUser: '', state: StateCupo.AVAILABLE },
    { id: 66, idUser: '', state: StateCupo.AVAILABLE },
    { id: 67, idUser: '', state: StateCupo.AVAILABLE },
    { id: 68, idUser: '', state: StateCupo.AVAILABLE },
    { id: 69, idUser: '', state: StateCupo.AVAILABLE },
    { id: 70, idUser: '', state: StateCupo.AVAILABLE },
    { id: 71, idUser: '', state: StateCupo.AVAILABLE },
    { id: 72, idUser: '', state: StateCupo.AVAILABLE },
    { id: 73, idUser: '', state: StateCupo.AVAILABLE },
    { id: 74, idUser: '', state: StateCupo.AVAILABLE },
    { id: 75, idUser: '', state: StateCupo.AVAILABLE },
    { id: 76, idUser: '', state: StateCupo.AVAILABLE },
    { id: 77, idUser: '', state: StateCupo.AVAILABLE },
    { id: 78, idUser: '', state: StateCupo.AVAILABLE },
    { id: 79, idUser: '', state: StateCupo.AVAILABLE },
    { id: 80, idUser: '', state: StateCupo.AVAILABLE },
    { id: 81, idUser: '', state: StateCupo.AVAILABLE },
    { id: 82, idUser: '', state: StateCupo.AVAILABLE },
    { id: 83, idUser: '', state: StateCupo.AVAILABLE },
    { id: 84, idUser: '', state: StateCupo.AVAILABLE },
    { id: 85, idUser: '', state: StateCupo.AVAILABLE },
    { id: 86, idUser: '', state: StateCupo.AVAILABLE },
    { id: 87, idUser: '', state: StateCupo.AVAILABLE },
    { id: 88, idUser: '', state: StateCupo.AVAILABLE },
    { id: 89, idUser: '', state: StateCupo.AVAILABLE },
    { id: 90, idUser: '', state: StateCupo.AVAILABLE },
    {
      id: 91,
      idUser: '',
      state: StateCupo.AVAILABLE,
    },
    { id: 92, idUser: '', state: StateCupo.AVAILABLE },
    { id: 93, idUser: '', state: StateCupo.AVAILABLE },
    { id: 94, idUser: '', state: StateCupo.AVAILABLE },
    { id: 95, idUser: '', state: StateCupo.AVAILABLE },
    { id: 96, idUser: '', state: StateCupo.AVAILABLE },
    { id: 97, idUser: '', state: StateCupo.AVAILABLE },
    { id: 98, idUser: '', state: StateCupo.AVAILABLE },
    { id: 99, idUser: '', state: StateCupo.AVAILABLE },
    {
      id: 100,
      idUser: '',
      state: StateCupo.AVAILABLE,
    },
  ];

  constructor() {}

  ngOnInit(): void {}

  public changeCupoState(cupo: Icupo): void {
    let index: number = this.cuposTodos.findIndex(
      (cupoLocal: Icupo) => cupoLocal.id == cupo.id
    );

    if (index == -1) return;

    if (cupo.state == StateCupo.AVAILABLE) {
      this.cuposTodos[index].state = StateCupo.SELECT;
      this.totalPrice += this.modelSubscriptionPrice;
    } else {
      this.cuposTodos[index].state = StateCupo.AVAILABLE;
      this.totalPrice -= this.modelSubscriptionPrice;
    }
  }
}
