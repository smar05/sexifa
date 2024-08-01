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
import { ClipboardService } from 'ngx-clipboard';
import { EnumPages } from 'src/app/enum/enum-pages';
import { EnumVariablesGlobales } from 'src/app/enum/enum-variables-globales';
import { UrlPagesEnum } from 'src/app/enum/urlPagesEnum';
import { alerts } from 'src/app/helpers/alerts';
import { functions } from 'src/app/helpers/functions';
import { Isubscriptions } from 'src/app/interface/i- subscriptions';
import { IFrontLogs } from 'src/app/interface/i-front-logs';
import { IFireStoreRes } from 'src/app/interface/ifireStoreRes';
import { Imodels } from 'src/app/interface/imodels';
import { AlertsPagesService } from 'src/app/services/alerts-page.service';
import { FrontLogsService } from 'src/app/services/front-logs.service';
import { ModelsService } from 'src/app/services/models.service';
import { SubscriptionsService } from 'src/app/services/subscriptions.service';
import { VariablesGlobalesService } from 'src/app/services/variables-globales.service';
import { IButtonComponent } from 'src/app/shared/button/button.component';
import { environment } from 'src/environments/environment';

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
  public model: Imodels;
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
  public eyeButton: IButtonComponent = {
    class: 'btn btn-sm btn-warning mr-1',
    text: '<i class="fas fa-eye"></i>',
  };
  public urlModelPage: string = '';

  //Paginador
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  //Orden
  @ViewChild(MatSort) sort!: MatSort;

  async ngOnInit(): Promise<void> {
    functions.bloquearPantalla(true);
    this.alertPage();
    this.userId = this.variablesGlobalesService.getCurrentValue(
      EnumVariablesGlobales.USER_ID
    );
    try {
      await this.getMiGroup();
      await this.getSubscriptions();
    } catch (error) {
      console.error('Error: ', error);
      alerts.basicAlert('Error', 'Ha ocurrido un error', 'error');

      let data: IFrontLogs = {
        date: new Date(),
        userId: this.variablesGlobalesService.getCurrentValue(
          EnumVariablesGlobales.USER_ID
        ),
        log: `file: home-seller.component.ts: ~ HomeSellerComponent ~ ngOnInit ~ JSON.stringify(error): ${JSON.stringify(
          error
        )}`,
      };

      this.frontLogsService
        .postDataFS(data)
        .then((res) => {})
        .catch((err) => {
          alerts.basicAlert('Error', 'Error', 'error');
          throw err;
        });
      throw error;
    }
    functions.bloquearPantalla(false);
  }

  constructor(
    private subscriptionsService: SubscriptionsService,
    private modelsService: ModelsService,
    private frontLogsService: FrontLogsService,
    private alertsPagesService: AlertsPagesService,
    private clipboardService: ClipboardService,
    private variablesGlobalesService: VariablesGlobalesService
  ) {}

  public async getMiGroup(): Promise<void> {
    functions.bloquearPantalla(true);
    this.loading = true;
    let qf: QueryFn = (ref) => ref.where('idUser', '==', this.userId);

    let res: IFireStoreRes[] = null;

    try {
      res = await this.modelsService.getDataFS(qf).toPromise();
    } catch (error) {
      console.error('Error: ', error);
      alerts.basicAlert(
        'Error',
        'Ha ocurrido un error en la consulta de modelos',
        'error'
      );

      let data: IFrontLogs = {
        date: new Date(),
        userId: this.variablesGlobalesService.getCurrentValue(
          EnumVariablesGlobales.USER_ID
        ),
        log: `file: home-seller.component.ts: ~ HomeSellerComponent ~ getMiGroup ~ JSON.stringify(error): ${JSON.stringify(
          error
        )}`,
      };

      this.frontLogsService
        .postDataFS(data)
        .then((res) => {})
        .catch((err) => {
          alerts.basicAlert('Error', 'Error', 'error');
          throw err;
        });
      throw error;
    }

    this.model = res[0].data;
    this.model.id = res[0].id;

    this.urlModelPage = `${environment.urlProd}#/${UrlPagesEnum.GROUP}/${this.model.url}`;

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

    let res: IFireStoreRes[] = null;

    try {
      res = await this.subscriptionsService.getDataFS(qf).toPromise();
    } catch (error) {
      console.error('Error: ', error);
      alerts.basicAlert(
        'Error',
        'Ha ocurrido un error en la consulta de subscripciones',
        'error'
      );

      let data: IFrontLogs = {
        date: new Date(),
        userId: this.variablesGlobalesService.getCurrentValue(
          EnumVariablesGlobales.USER_ID
        ),
        log: `file: home-seller.component.ts: ~ HomeSellerComponent ~ getSubscriptions ~ JSON.stringify(error): ${JSON.stringify(
          error
        )}`,
      };

      this.frontLogsService
        .postDataFS(data)
        .then((res) => {})
        .catch((err) => {
          alerts.basicAlert('Error', 'Error', 'error');
          throw err;
        });
      throw error;
    }

    this.subscriptions = res.map((r: IFireStoreRes) => {
      let s: Isubscriptions = r.data;
      s.id = r.id;
      return s;
    });

    // Ordena de la más reciente a la más antigua
    this.subscriptions = this.subscriptions.sort(
      (a: Isubscriptions, b: Isubscriptions): number => {
        const fechaA = new Date(a.date_created);
        const fechaB = new Date(b.date_created);

        return fechaB.getTime() - fechaA.getTime();
      }
    );

    let position: number = 1;

    let subscriptionsAux: any[] = this.subscriptions.map(
      (r: Isubscriptions) => {
        return {
          position: position++,
          userId: r.userId,
          fecha: r.date_created,
          statusUser: r.status,
          price: r.price,
          beginTime: r.beginTime,
          endTime: r.endTime,
          modelStatus: r.modelStatus,
        };
      }
    );

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

  private alertPage(): void {
    this.alertsPagesService
      .alertPage(EnumPages.HOME_SELLER)
      .toPromise()
      .then((res: any) => {});
  }

  public copyToClipboardUrlModel(): void {
    if (!this.urlModelPage) return;

    this.clipboardService.copyFromContent(this.urlModelPage);
    alert('URL copiada al portapapeles!');
  }

  public exportarSubscripciones(): void {
    if (!(this.subscriptions && this.subscriptions.length > 0)) {
      alerts.basicAlert(
        'Alerta',
        'No hay subscripciones por consultar',
        'warning'
      );
      return;
    }

    functions.bloquearPantalla(true);
    this.loading = true;
    let data: any = this.subscriptions.map((subscripcion: Isubscriptions) => {
      let r: any = {
        id: subscripcion.id,
        userId: subscripcion.userId,
        status: subscripcion.status,
        time: subscripcion.time,
        beginTime: subscripcion.beginTime,
        endTime: subscripcion.endTime,
        price: subscripcion.price,
        commission: `${subscripcion.commission * 100}%`,
        commissionValue: subscripcion.price * subscripcion.commission,
        total: subscripcion.price * (1 - subscripcion.commission),
      };

      return r;
    });

    let options: any = {
      title: 'Detalle de las subscripciones',
      fieldSeparator: ';',
      quoteString: '"',
      decimalSeparator: '.',
      showLabels: true,
      noDownload: false,
      showTitle: false,
      useBom: false,
      headers: [
        'Id de la subscripción',
        'Id del usuario',
        'Estado de la subscripción',
        'Tiempo de la subscripción (Meses)',
        'Inicio de la subscripción',
        'Fin de la subscripción',
        'Precio (USD)',
        'Comisión (%)',
        'Comisión (USD)',
        'Total (USD)',
      ],
    };

    functions.getCsv(
      data,
      `subscripciones${new Date().toISOString().split(' ').join('_')}`,
      options
    );

    functions.bloquearPantalla(false);
    this.loading = false;

    alerts.basicAlert('Listo', 'Archivo generado', 'success');
  }
}
