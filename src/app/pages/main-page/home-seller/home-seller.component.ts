import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { QueryFn } from '@angular/fire/compat/firestore';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LocalStorageEnum } from 'src/app/enum/localStorageEnum';
import { functions } from 'src/app/helpers/functions';
import { Isubscriptions } from 'src/app/interface/i- subscriptions';
import { IFireStoreRes } from 'src/app/interface/ifireStoreRes';
import { Imodels } from 'src/app/interface/imodels';
import { ModelsService } from 'src/app/services/models.service';
import { SubscriptionsService } from 'src/app/services/subscriptions.service';

@Component({
  selector: 'app-home-seller',
  templateUrl: './home-seller.component.html',
  styleUrls: ['./home-seller.component.css'],
  animations: [
    trigger('detailExpand', [
      state(
        'collapsed,void',
        style({ height: '0px', minHeight: '0', display: 'none' })
      ),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
      transition(
        'expanded <=> void',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class HomeSellerComponent implements OnInit {
  private userId: string = '';
  private model: Imodels;
  public subscriptions: Isubscriptions[] = [];
  public loading: boolean = false;

  public dataSource!: MatTableDataSource<Isubscriptions>; //Instancia la data que aparecera en la tabla
  public expandedElement!: Isubscriptions | null;
  public displayedColumns: string[] = [
    'position',
    'fecha',
    'statusUser',
    'actions',
  ]; //Variable para nombrar las columnas de la tabla

  //Paginador
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  //Orden
  @ViewChild(MatSort) sort!: MatSort;

  async ngOnInit(): Promise<void> {
    functions.bloquearPantalla(true);
    this.userId = localStorage.getItem(LocalStorageEnum.LOCAL_ID);
    await this.getMiGroup();
    await this.getSubscriptions();
    functions.bloquearPantalla(false);
  }

  constructor(
    private subscriptionsService: SubscriptionsService,
    private modelsService: ModelsService
  ) {}

  public async getMiGroup(): Promise<void> {
    functions.bloquearPantalla(true);
    this.loading = true;
    let qf: QueryFn = (ref) => ref.where('idUser', '==', this.userId);

    let res: IFireStoreRes[] = await this.modelsService
      .getDataFS(qf)
      .toPromise();

    this.model = res[0].data;
    this.model.id = res[0].id;

    functions.bloquearPantalla(false);
    this.loading = false;
  }

  public async getSubscriptions(): Promise<void> {
    functions.bloquearPantalla(true);
    this.loading = true;
    let qf: QueryFn = (ref) =>
      ref
        .where('modelId', '==', this.model.id)
        .limitToLast(50)
        .orderBy('date_created');

    let res: IFireStoreRes[] = await this.subscriptionsService
      .getDataFS(qf)
      .toPromise();

    this.subscriptions = res.map((r: IFireStoreRes) => {
      let s: Isubscriptions = r.data;
      s.id = r.id;
      return s;
    });

    let position: number = res.length;

    let subscriptionsAux: any[] = res.map((r: IFireStoreRes) => {
      return {
        position: position--,
        userId: r.data.userId,
        fecha: r.data.date_created,
        statusUser: r.data.status,
        price: r.data.price,
        beginTime: r.data.beginTime,
        endTime: r.data.endTime,
        modelStatus: r.data.modelStatus,
      };
    });

    this.dataSource = new MatTableDataSource(subscriptionsAux);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    functions.bloquearPantalla(false);
    this.loading = false;
  }

  //FIltro de busqueda
  public applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
