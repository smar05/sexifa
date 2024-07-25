import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, ViewChild } from '@angular/core';
import { QueryFn } from '@angular/fire/compat/firestore';
import { FormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EnumPages } from 'src/app/enum/enum-pages';
import { EnumExpresioncesRegulares } from 'src/app/enum/EnumExpresionesRegulares';
import { LocalStorageEnum } from 'src/app/enum/localStorageEnum';
import { ModelStatusEnum } from 'src/app/enum/modelStatusEnum';
import { alerts } from 'src/app/helpers/alerts';
import { functions } from 'src/app/helpers/functions';
import { Isubscriptions } from 'src/app/interface/i- subscriptions';
import { IFrontLogs } from 'src/app/interface/i-front-logs';
import { EnumSaldosStatus, ISaldos } from 'src/app/interface/i-saldos';
import { ICities } from 'src/app/interface/icities';
import { ICountries } from 'src/app/interface/icountries';
import { IFireStoreRes } from 'src/app/interface/ifireStoreRes';
import { IState } from 'src/app/interface/istate';
import { Iuser } from 'src/app/interface/iuser';
import { AlertsPagesService } from 'src/app/services/alerts-page.service';
import { FrontLogsService } from 'src/app/services/front-logs.service';
import { LocationService } from 'src/app/services/location.service';
import { SaldosService } from 'src/app/services/saldos.service';
import { SubscriptionsService } from 'src/app/services/subscriptions.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-seller',
  templateUrl: './user-seller.component.html',
  styleUrls: ['./user-seller.component.css'],
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
export class UserSellerComponent {
  public subscripcionesPendientes: Isubscriptions[] = null;
  public saldoPendiente: number = undefined;
  public saldosSolicitados: ISaldos[] = null;
  public dataSource!: MatTableDataSource<any>; //Instancia la data que aparecera en la tabla
  //Paginador
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  //Orden
  @ViewChild(MatSort) sort!: MatSort;
  public expandedElement!: Isubscriptions | null;
  public displayedColumns: string[] = ['position', 'fecha', 'status', 'price']; //Variable para nombrar las columnas de la tabla
  public f: any = this.form.group({
    name: [
      '',
      [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern(EnumExpresioncesRegulares.CARACTERES),
      ],
    ],
    email: [
      '',
      [
        Validators.required,
        Validators.email,
        Validators.maxLength(320),
        Validators.pattern(EnumExpresioncesRegulares.EMAIL),
      ],
    ],
    celphone: [
      '',
      [
        Validators.required,
        Validators.max(9999999999),
        Validators.pattern(EnumExpresioncesRegulares.NUMEROS),
      ],
    ],
    bornDate: ['', [Validators.required]],
    country: [
      '',
      [
        Validators.required,
        Validators.pattern(EnumExpresioncesRegulares.CARACTERES),
        Validators.minLength(2),
        Validators.maxLength(5),
      ],
    ],
    state: [
      '',
      [
        Validators.required,
        Validators.pattern(EnumExpresioncesRegulares.CARACTERES),
        Validators.minLength(2),
        Validators.maxLength(5),
      ],
    ],
    city: ['', [Validators.required]],
    sex: [
      '',
      [
        Validators.required,
        Validators.pattern(EnumExpresioncesRegulares.CARACTERES),
        Validators.maxLength(15),
      ],
    ],
    document_type: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(3)],
    ],
    document_value: [
      '',
      [Validators.required, Validators.minLength(6), Validators.maxLength(10)],
    ],
  });

  //Validaciones personalizadas
  get name() {
    return this.f.controls.name;
  }

  get email() {
    return this.f.controls.email;
  }

  get celphone() {
    return this.f.controls.celphone;
  }

  get bornDate() {
    return this.f.controls.bornDate;
  }

  get country() {
    return this.f.controls.country;
  }

  get state() {
    return this.f.controls.state;
  }

  get city() {
    return this.f.controls.city;
  }

  get sex() {
    return this.f.controls.sex;
  }

  get password() {
    return this.f.controls.password;
  }

  get repeatPassword() {
    return this.f.controls.repeatPassword;
  }

  get terms() {
    return this.f.controls.terms;
  }

  get document_type() {
    return this.f.controls.document_type;
  }

  get document_value() {
    return this.f.controls.document_value;
  }

  public formSubmitted: boolean = false;
  public loading: boolean = false;
  private nameUserId: string = '';
  private user!: Iuser;

  public allCountrys: ICountries[] = [];
  public allStates: IState[] = [];
  public allCities: ICities[] = [];

  constructor(
    private form: FormBuilder,
    private userService: UserService,
    private locationService: LocationService,
    private frontLogsService: FrontLogsService,
    private subscriptionsService: SubscriptionsService,
    private saldosService: SaldosService,
    private alertsPagesService: AlertsPagesService
  ) {}

  async ngOnInit(): Promise<void> {
    functions.bloquearPantalla(true);
    this.alertPage();
    try {
      await this.getUserData();
      await this.getLocationData();
    } catch (error) {
      this.frontLogsService.catchProcessError(
        error,
        {
          title: 'Error',
          text: 'Ha ocurrido un error',
          icon: 'error',
        },
        `file: user-seller.component.ts: ~ UserSellerComponent ~ ngOnInit ~ JSON.stringify(error): ${JSON.stringify(
          error
        )}`
      );
    }
    functions.bloquearPantalla(false);
  }

  public async getUserData(): Promise<void> {
    functions.bloquearPantalla(true);
    this.loading = true;
    let qf: QueryFn = (ref) =>
      ref.where('id', '==', localStorage.getItem(LocalStorageEnum.LOCAL_ID));

    this.user = await new Promise((resolve) => {
      this.userService
        .getDataFS(qf)
        .toPromise()
        .then(
          (data: IFireStoreRes[]) => {
            this.nameUserId = data[0].id;
            resolve(data[0].data);
          },
          (err) => {
            console.error(err);
            alerts.basicAlert(
              'Error',
              'Ha ocurrido un error en la consulta de usuarios',
              'error'
            );

            let data: IFrontLogs = {
              date: new Date(),
              userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
              log: `file: user-seller.component.ts:151 ~ UserSellerComponent ~ JSON.stringify(error): ${JSON.stringify(
                err
              )}`,
            };

            this.frontLogsService
              .postDataFS(data)
              .then((res) => {})
              .catch((err) => {
                alerts.basicAlert('Error', 'Error', 'error');
                throw err;
              });

            resolve(null);
            throw err;
          }
        );
    });

    this.name.setValue(this.user.name);
    this.email.setValue(this.user.email);
    this.celphone.setValue(this.user.celphone);
    this.bornDate.setValue(new Date(this.user.bornDate).toDateString());
    this.sex.setValue(this.user.sex);
    this.country.setValue(this.user.country);
    this.state.setValue(this.user.state);
    this.city.setValue(this.user.city);
    this.document_type.setValue(this.user.document_type || '');
    this.document_value.setValue(this.user.document_value);

    functions.bloquearPantalla(false);
    this.loading = false;
  }

  public async onSubmit(f: any): Promise<void> {
    //Validacion del formulario
    if (this.f.invalid) {
      alerts.basicAlert('Error', 'El formulario es invalido', 'warning');
      return;
    }

    functions.bloquearPantalla(true);
    this.loading = true;

    const data: Iuser = {
      id: this.user.id,
      name: this.name.value,
      email: this.user.email,
      celphone: this.celphone.value,
      bornDate: this.user.bornDate,
      sex: this.sex.value,
      status: this.user.status,
      country: this.country.value,
      state: this.state.value,
      city: this.city.value,
      chatId: this.user.chatId,
      type: this.user.type,
      document_type: this.user.document_type,
      document_value: this.user.document_value,
    };

    this.userService.patchDataFS(this.nameUserId, data).then(
      (res: any) => {
        alerts.basicAlert(
          'Listo',
          'Se ha guardado la informacion del usuario',
          'success'
        );
        functions.bloquearPantalla(false);
        this.loading = false;
      },
      (error: any) => {
        alerts.basicAlert(
          'Error',
          'Ha ocurrido un error al guardar la informacion del usuario',
          'error'
        );

        let data: IFrontLogs = {
          date: new Date(),
          userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
          log: `file: user-seller.component.ts:226 ~ UserSellerComponent ~ onSubmit ~ JSON.stringify(error): ${JSON.stringify(
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
    );
  }

  /**
   *Validacion del formulario
   *
   * @param {string} field
   * @return {*}  {boolean}
   * @memberof RegisterComponent
   */
  public invalidField(field: string): boolean {
    return functions.invalidField(field, this.f, this.formSubmitted);
  }

  public mayor18Anios(): boolean {
    let hoy: Date = new Date();
    let mayor18: Date = new Date();
    let date: Date = new Date(this.bornDate.value);

    mayor18.setFullYear(hoy.getFullYear() - 18);

    return mayor18 >= date;
  }

  public async getLocationData(): Promise<void> {
    functions.bloquearPantalla(true);
    this.loading = true;
    try {
      this.allCountrys = JSON.parse(
        await this.locationService.getAllContries()
      );
      this.allStates = JSON.parse(
        await this.locationService.getAllStatesByCountry(this.country.value)
      );
      this.allCities = JSON.parse(
        await this.locationService.getAllCitiesByCountryAndState(
          this.country.value,
          this.state.value
        )
      );

      functions.bloquearPantalla(false);
      this.loading = false;
    } catch (error) {
      this.loading = false;
      this.allCountrys = [];
      this.allStates = [];
      this.allCities = [];

      this.frontLogsService.catchProcessError(
        error,
        {
          title: 'Error',
          text: 'Ha ocurrido un error en la consulta de ubicaciones',
          icon: 'error',
        },
        `file: user-seller.component.ts: ~ UserSellerComponent ~ getLocationData ~ JSON.stringify(error): ${JSON.stringify(
          error
        )}`
      );
    }
  }

  public async countryChange(): Promise<void> {
    try {
      this.state.setValue(null);
      this.city.setValue(null);
      this.allStates = null;
      this.allCities = null;
      this.allStates = JSON.parse(
        await this.locationService.getAllStatesByCountry(this.country.value)
      );
    } catch (error) {
      this.frontLogsService.catchProcessError(
        error,
        {
          title: 'Error',
          text: 'Ha ocurrido un error en la consulta de ubicaciones',
          icon: 'error',
        },
        `file: user-seller.component.ts: ~ UserSellerComponent ~ countryChange ~ JSON.stringify(error): ${JSON.stringify(
          error
        )}`
      );
    }
  }

  public async stateChange(): Promise<void> {
    try {
      this.city.setValue(null);
      this.allCities = null;
      this.allCities = JSON.parse(
        await this.locationService.getAllCitiesByCountryAndState(
          this.country.value,
          this.state.value
        )
      );
    } catch (error) {
      this.frontLogsService.catchProcessError(
        error,
        {
          title: 'Error',
          text: 'Ha ocurrido un error en la consulta de ubicaciones',
          icon: 'error',
        },
        `file: user-seller.component.ts: ~ UserSellerComponent ~ stateChange ~ JSON.stringify(error): ${JSON.stringify(
          error
        )}`
      );
    }
  }

  public async onClickSaldoPendiente(): Promise<void> {
    if (this.saldoPendiente >= 0) {
      alerts.basicAlert('Información', 'El saldo ya se ha calculado', 'info');
      return;
    }

    await this.calcularSaldoModelo();
  }

  private async calcularSaldoModelo(): Promise<void> {
    functions.bloquearPantalla(true);
    this.loading = true;

    this.saldoPendiente = undefined;
    let modelId: string = localStorage.getItem(LocalStorageEnum.MODEL_ID);

    if (!modelId) {
      return undefined;
    }

    let data: IFireStoreRes[] = null;
    try {
      let qf: QueryFn = (ref) =>
        ref
          .where('modelId', '==', modelId)
          .where('modelStatus', '==', ModelStatusEnum.PENDIENTE_PAGO);
      data = await this.subscriptionsService.getDataFS(qf).toPromise();
    } catch (error) {
      this.frontLogsService.catchProcessError(
        error,
        {
          title: 'Error',
          text: 'Ha ocurrido un error en la consulta de usuarios',
          icon: 'error',
        },
        `file: user-seller.component.ts: ~ UserSellerComponent ~ calcularSaldoModelo ~ JSON.stringify(error): ${JSON.stringify(
          error
        )}`
      );

      this.loading = false;
    }

    if (!data) return undefined;

    this.subscripcionesPendientes = data.map((a: IFireStoreRes) => {
      return { id: a.id, ...a.data };
    });

    this.saldoPendiente = this.subscripcionesPendientes.reduce(
      (pv: number, cv: Isubscriptions) => {
        return pv + Math.floor(cv.price * (1 - cv.commission) * 100) / 100;
      },
      0
    );

    functions.bloquearPantalla(false);
    this.loading = false;
  }

  public exportarSaldo(): void {
    if (
      !(this.saldoPendiente > 0 && this.subscripcionesPendientes.length > 0)
    ) {
      alerts.basicAlert(
        'Alerta',
        'No hay subscripciones por consultar',
        'warning'
      );
      return;
    }

    functions.bloquearPantalla(true);
    this.loading = true;
    let data: any = this.subscripcionesPendientes.map(
      (subscripcion: Isubscriptions) => {
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
      }
    );

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
      `saldo_pendiente_${new Date().toISOString().split(' ').join('_')}`,
      options
    );

    functions.bloquearPantalla(false);
    this.loading = false;

    alerts.basicAlert('Listo', 'Archivo generado', 'success');
  }

  public async onClickGetSaldosSolicitados(): Promise<void> {
    await this.getSaldosSolicitados();
  }

  private async getSaldosSolicitados(): Promise<void> {
    if (this.saldosSolicitados && this.saldosSolicitados.length > 0) {
      alerts.basicAlert(
        'Información',
        'Los saldos ya han sido consultados',
        'info'
      );
      return;
    }

    functions.bloquearPantalla(true);
    this.loading = true;

    let modelId: string = localStorage.getItem(LocalStorageEnum.MODEL_ID);

    if (!modelId) {
      functions.bloquearPantalla(false);
      this.loading = false;
      return undefined;
    }

    let data: IFireStoreRes[] = null;
    try {
      let qf: QueryFn = (ref) =>
        ref.where('modelId', '==', modelId).orderBy('status').limit(50);

      data = await this.saldosService.getDataFS(qf).toPromise();
    } catch (error) {
      this.frontLogsService.catchProcessError(
        error,
        {
          title: 'Error',
          text: 'Ha ocurrido un error en la consulta de usuarios',
          icon: 'error',
        },
        `file: user-seller.component.ts: ~ UserSellerComponent ~ getSaldosSolicitados ~ JSON.stringify(error): ${JSON.stringify(
          error
        )}`
      );

      this.loading = false;
    }

    if (!data || data.length == 0) {
      alerts.basicAlert(
        'Información',
        'No se han encontrado solicitudes de saldos',
        'info'
      );
      return;
    }

    this.saldosSolicitados = data.map((a: IFireStoreRes) => {
      return { id: a.id, ...a.data };
    });

    let position: number = 1;

    let saldosAux: any[] = this.saldosSolicitados.map((r: ISaldos) => {
      return {
        position: position++,
        fecha: r.date_created,
        status: r.status,
        price: r.price,
      };
    });

    this.dataSource = new MatTableDataSource(saldosAux);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    functions.bloquearPantalla(false);
    this.loading = false;
  }

  public async solicitarSaldo(): Promise<void> {
    functions.bloquearPantalla(true);
    this.loading = true;

    if (this.saldoPendiente < 100) {
      alerts.basicAlert(
        'Alerta',
        'El saldo minimo para solicitar es de USD100',
        'warning'
      );
      functions.bloquearPantalla(false);
      this.loading = false;
      return;
    }

    let modelId: string = localStorage.getItem(LocalStorageEnum.MODEL_ID);

    if (!modelId) {
      functions.bloquearPantalla(false);
      this.loading = false;
      return undefined;
    }

    let dataUpdate: { doc: string; data: any }[] =
      this.subscripcionesPendientes.map((sp: Isubscriptions) => {
        let a: { doc: string; data: any } = {
          doc: sp.id,
          data: { ...sp, modelStatus: ModelStatusEnum.SALDO_SOLICITADO },
        };

        delete a.data.id;

        return a;
      });

    try {
      await this.subscriptionsService.updateDocuments(dataUpdate);
    } catch (error) {
      this.frontLogsService.catchProcessError(
        error,
        {
          title: 'Error',
          text: 'Ha ocurrido un error en la consulta de usuarios',
          icon: 'error',
        },
        `file: user-seller.component.ts: ~ UserSellerComponent ~ solicitarSaldo ~ JSON.stringify(error): ${JSON.stringify(
          error
        )}`
      );

      this.loading = false;
    }

    let saldoData: ISaldos = {
      date_created: new Date().toISOString(),
      modelId,
      status: EnumSaldosStatus.SOLICITADO,
      idsSubscriptions: this.subscripcionesPendientes.map(
        (sp: Isubscriptions) => {
          return sp.id;
        }
      ),
      price: this.saldoPendiente,
    };

    try {
      await this.saldosService.postDataFS(saldoData);
    } catch (error) {
      this.frontLogsService.catchProcessError(
        error,
        {
          title: 'Error',
          text: 'Ha ocurrido un error en la consulta de usuarios',
          icon: 'error',
        },
        `file: user-seller.component.ts: ~ UserSellerComponent ~ solicitarSaldo ~ JSON.stringify(error): ${JSON.stringify(
          error
        )}`
      );

      this.loading = false;
    }

    alerts.basicAlert('Listo', 'El saldo ya ha sido solicitado', 'success');

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
      .alertPage(EnumPages.USER_SELLER)
      .toPromise()
      .then((res: any) => {});
  }
}
