import { ICities } from './../../../interface/icities';
import { IState } from './../../../interface/istate';
import { ICountries } from './../../../interface/icountries';
import { LocationService } from './../../../services/location.service';
import { Iuser } from 'src/app/interface/iuser';
import { UserService } from './../../../services/user.service';
import { alerts } from 'src/app/helpers/alerts';
import { functions } from 'src/app/helpers/functions';
import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { LocalStorageEnum } from 'src/app/enum/localStorageEnum';
import { TelegramLocalService } from 'src/app/services/telegram-local.service';
import { QueryFn } from '@angular/fire/compat/firestore';
import { IFireStoreRes } from 'src/app/interface/ifireStoreRes';
import { MatTableDataSource } from '@angular/material/table';
import { Isubscriptions } from 'src/app/interface/i- subscriptions';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SubscriptionsService } from 'src/app/services/subscriptions.service';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { IFrontLogs } from 'src/app/interface/i-front-logs';
import { FrontLogsService } from 'src/app/services/front-logs.service';
import { EnumExpresioncesRegulares } from 'src/app/enum/EnumExpresionesRegulares';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
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
export class UserComponent implements OnInit {
  public showSubscripciones: boolean = false;
  public urlBotChatId: string = `${environment.urlBot}?start=my_id`;

  public dataSource!: MatTableDataSource<Isubscriptions>; //Instancia la data que aparecera en la tabla
  public expandedElement!: Isubscriptions | null;
  public displayedColumns: string[] = [
    'position',
    'fecha',
    'status',
    'actions',
  ]; //Variable para nombrar las columnas de la tabla
  //Paginador
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  //Orden
  @ViewChild(MatSort) sort!: MatSort;

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
      [Validators.required, Validators.email, Validators.maxLength(320)],
    ],
    celphone: [
      '',
      [
        Validators.required,
        Validators.max(9999999999),
        Validators.pattern(EnumExpresioncesRegulares.NUMEROS),
      ],
    ],
    chatId: [
      '',
      [
        Validators.required,
        Validators.max(99999999999999999999),
        Validators.pattern(EnumExpresioncesRegulares.NUMEROS),
        Validators.pattern(/^\d{10}$/),
      ],
    ],
    bornDate: ['', [Validators.required]],
    country: ['', [Validators.required]],
    state: ['', [Validators.required]],
    city: ['', [Validators.required]],
    sex: ['', [Validators.required]],
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

  get chatId() {
    return this.f.controls.chatId;
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
    private telegramLocalService: TelegramLocalService,
    private subscriptionsService: SubscriptionsService,
    private frontLogsService: FrontLogsService
  ) {}

  async ngOnInit(): Promise<void> {
    functions.bloquearPantalla(true);
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
        `file: user.component.ts: ~ UserComponent ~ ngOnInit ~ JSON.stringify(error): ${JSON.stringify(
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
              log: `file: user.component.ts: ~ UserComponent ~ JSON.stringify(error): ${JSON.stringify(
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
    this.chatId.setValue(this.user.chatId);
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
      chatId: this.chatId.value,
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
          log: `file: user.component.ts: ~ UserComponent ~ onSubmit ~ JSON.stringify(error): ${JSON.stringify(
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
      console.error('Error: ', error);
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
        `file: user.component.ts: ~ UserComponent ~ getLocationData ~ JSON.stringify(error): ${JSON.stringify(
          error
        )}`
      );

      this.loading = false;
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
      console.error('Error: ', error);
      this.allStates = [];
      this.state.setValue(null);
      this.city.setValue(null);

      this.frontLogsService.catchProcessError(
        error,
        {
          title: 'Error',
          text: 'Ha ocurrido un error en la consulta de ubicaciones',
          icon: 'error',
        },
        `file: user.component.ts: ~ UserComponent ~ countryChange ~ JSON.stringify(error): ${JSON.stringify(
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
      console.error('Error: ', error);
      this.allCities = [];
      this.city.setValue(null);
      this.frontLogsService.catchProcessError(
        error,
        {
          title: 'Error',
          text: 'Ha ocurrido un error en la consulta de ubicaciones',
          icon: 'error',
        },
        `file: user.component.ts: ~ UserComponent ~ stateChange ~ JSON.stringify(error): ${JSON.stringify(
          error
        )}`
      );
    }
  }

  public async probarConexionBot(): Promise<void> {
    functions.bloquearPantalla(true);

    try {
      await this.telegramLocalService.probarConexionBot(this.chatId.value);
    } catch (error) {
      functions.bloquearPantalla(false);
      throw error;
    }

    functions.bloquearPantalla(false);
  }

  //FIltro de busqueda
  public applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public async misSubscripciones(): Promise<void> {
    this.showSubscripciones = !this.showSubscripciones;

    if (!this.showSubscripciones) return;

    functions.bloquearPantalla(true);
    this.loading = true;

    let userId = localStorage.getItem(LocalStorageEnum.LOCAL_ID);
    let qf: QueryFn = (ref) =>
      ref.where('userId', '==', userId).limitToLast(50).orderBy('date_created');

    let res: IFireStoreRes[] = null;
    try {
      res = await this.subscriptionsService.getDataFS(qf).toPromise();
    } catch (error) {
      this.frontLogsService.catchProcessError(
        error,
        {
          title: 'Error',
          text: 'Ha ocurrido un error en la consulta de subscripciones',
          icon: 'error',
        },
        `file: user.component.ts: ~ UserComponent ~ misSubscripciones ~ JSON.stringify(error): ${JSON.stringify(
          error
        )}`
      );
    }
    let position: number = 1;

    let subscriptionsAux: any[] = res.map((r: IFireStoreRes) => {
      return {
        idGrupo: r.data.modelId,
        fecha: r.data.date_created,
        status: r.data.status,
        price: r.data.price,
        beginTime: r.data.beginTime,
        endTime: r.data.endTime,
        payMethod: r.data.payMethod,
      };
    });

    // Ordena de la más reciente a la más antigua
    subscriptionsAux = subscriptionsAux.sort((a: any, b: any): number => {
      const fechaA = new Date(a.fecha);
      const fechaB = new Date(b.fecha);

      return fechaB.getTime() - fechaA.getTime();
    });

    subscriptionsAux = subscriptionsAux.map((r: any) => {
      return {
        position: position++,
        ...r,
      };
    });

    this.dataSource = new MatTableDataSource(subscriptionsAux);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    functions.bloquearPantalla(false);
    this.loading = false;
  }

  public infoClik(): void {
    alerts.basicAlert(
      'Consultar ID',
      `Ingrese al chat con el bot y escriba el comando '/start' para obtener el id de su chat`,
      'info'
    );
  }
}
