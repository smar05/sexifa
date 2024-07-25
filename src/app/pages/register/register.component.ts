import { UrlPagesEnum } from './../../enum/urlPagesEnum';
import { LocationService } from './../../services/location.service';
import { UserService } from './../../services/user.service';
import { alerts } from 'src/app/helpers/alerts';
import { RegisterService } from './../../services/register.service';
import { functions } from 'src/app/helpers/functions';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Iregister } from 'src/app/interface/iregister';
import { Router } from '@angular/router';
import { EnumUserDocumentType, Iuser } from 'src/app/interface/iuser';
import { ICountries } from 'src/app/interface/icountries';
import { IState } from 'src/app/interface/istate';
import { ICities } from 'src/app/interface/icities';
import { TelegramLocalService } from 'src/app/services/telegram-local.service';
import { UserStatusEnum } from 'src/app/enum/userStatusEnum';
import { UserTypeEnum } from 'src/app/enum/userTypeEnum';
import { FrontLogsService } from 'src/app/services/front-logs.service';
import { EnumExpresioncesRegulares } from 'src/app/enum/EnumExpresionesRegulares';
import { environment } from 'src/environments/environment';
import { SweetAlertIcon } from 'sweetalert2';
import { AlertsPagesService } from 'src/app/services/alerts-page.service';
import { EnumPages } from 'src/app/enum/enum-pages';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  public allCountries: ICountries[] = [];
  public allStatesByCountry: IState[] = [];
  public allCities: ICities[] = [];
  public urlBotChatId: string = `${environment.urlBot}?start=my_id`;
  public documentsType: { value: string; label: string }[] = [];

  //Grupo de controles
  public f: any = this.form.group({
    name: [
      '',
      [
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(5),
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
    chatId: [
      '',
      [
        Validators.max(9999999999),
        Validators.pattern(EnumExpresioncesRegulares.NUMEROS),
        Validators.pattern(/^\d{10}$/),
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
    city: [
      '',
      [
        Validators.required,
        Validators.pattern(EnumExpresioncesRegulares.NUMEROS_ENTEROS_POSITIVOS),
      ],
    ],
    sex: ['', [Validators.required]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(128),
        Validators.pattern(EnumExpresioncesRegulares.PASSWORD),
      ],
    ],
    repeatPassword: ['', [Validators.required]],
    terms: ['', [Validators.required]],
    type: ['', [Validators.required]],
    document_type: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(3),
        Validators.pattern(EnumExpresioncesRegulares.CARACTERES),
      ],
    ],
    document_value: [
      '',
      [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(10),
        Validators.pattern(EnumExpresioncesRegulares.CARACTERES),
      ],
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

  get type() {
    return this.f.controls.type;
  }

  get document_type() {
    return this.f.controls.document_type;
  }

  get document_value() {
    return this.f.controls.document_value;
  }

  public formSubmitted: boolean = false;
  public loading: boolean = false;
  public fechaMinimaEdad: string = null;

  constructor(
    private form: FormBuilder,
    private registerService: RegisterService,
    private router: Router,
    private userService: UserService,
    private locationService: LocationService,
    private telegramLocalService: TelegramLocalService,
    private frontLogsService: FrontLogsService,
    private alertsPagesService: AlertsPagesService
  ) {}

  ngOnInit(): void {
    functions.bloquearPantalla(true);
    this.alertPage();
    localStorage.clear();
    this.documentsType = this.getUserDocumentTypes();
    // Fecha minima para escoger la edad
    let fechaActual: Date = new Date();
    this.fechaMinimaEdad = new Date(
      fechaActual.getFullYear() - 18,
      fechaActual.getMonth(),
      fechaActual.getDate()
    )
      .toISOString()
      .split('T')[0];

    this.tipoDeUsuarios();
    this.f.controls.type.value = UserTypeEnum.USUARIO;
    this.getCountries();
    functions.bloquearPantalla(false);
  }

  public async onSubmit(f: any): Promise<void> {
    this.formSubmitted = true; //Formulario enviado

    //Formulario correcto
    if (
      !this.formValid() ||
      (this.type.value == 'usuario' && this.chatId.value == '')
    ) {
      alerts.basicAlert('Error', 'Formulario invalido', 'error');
      return;
    }

    //Capturamos la informacion del formulario de la interfaz
    const data: Iregister = {
      email: this.f.controls.email.value,
      password: this.f.controls.password.value,
    };

    functions.bloquearPantalla(true);
    this.loading = true;

    try {
      let resp: any = await this.registerService.registerAuth(data);
      const uid: string = resp.user.uid;

      this.registerService
        .verificEmail()
        .then((res: any) => {
          alerts.basicAlert(
            'Correo enviado',
            'Se te ha enviado un correo para verificacion',
            'info'
          );
        })
        .catch((err: any) => {
          this.frontLogsService.catchProcessError(
            err,
            {
              title: 'Error',
              text: 'Ha ocurrido un error enviando el correo de verificacion',
              icon: 'error',
            },
            `file: register.component.ts: ~ RegisterComponent ~ onSubmit ~ JSON.stringify(error): ${JSON.stringify(
              err
            )}`
          );
        });

      const user: Iuser = {
        id: uid,
        name: this.name.value,
        email: this.email.value,
        celphone: this.celphone.value,
        bornDate: this.bornDate.value,
        sex: this.sex.value,
        status:
          this.type == UserTypeEnum.USUARIO
            ? UserStatusEnum.ACTIVO
            : UserStatusEnum.PENDIENTE_CONFIRMAR,
        country: this.country.value,
        state: this.state.value,
        city: this.city.value,
        chatId: this.chatId.value,
        type: this.type.value,
        date_created: new Date().toISOString(),
        document_type: this.document_type.value,
        document_value: this.document_value.value,
      };

      await this.userService.postDataFS(user);

      functions.bloquearPantalla(false);
      this.loading = false;

      this.router.navigateByUrl(`/${UrlPagesEnum.LOGIN}`);
    } catch (error: any) {
      console.error('Error: ', error);

      let code: string = error.code;
      let errorText: string = '';

      switch (code) {
        case 'auth/email-already-in-use':
          errorText = 'El usuario ya existe';
          break;

        case 'auth/weak-password':
          errorText = 'La contraseña es muy debil';
          break;

        case 'auth/invalid-email':
          errorText = 'El correo es invalido';
          break;

        default:
          errorText = 'Se ha producido un error en el registro';
          break;
      }

      this.frontLogsService.catchProcessError(
        error,
        {
          title: 'Error',
          text: 'Error',
          icon: 'error',
        },
        `file: register.component.ts: ~ RegisterComponent ~ onSubmit ~ JSON.stringify(error): ${JSON.stringify(
          error
        )}`
      );

      this.loading = false;
    }
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

  public passwordCoincidence(): boolean {
    return this.password.value === this.repeatPassword.value;
  }

  public mayor18Anios(): boolean {
    let hoy: Date = new Date();
    let mayor18: Date = new Date();
    let date: Date = new Date(this.bornDate.value);

    mayor18.setFullYear(hoy.getFullYear() - 18);

    return mayor18 >= date;
  }

  public formValid(): boolean {
    return !this.f.invalid && this.passwordCoincidence() && this.mayor18Anios();
  }

  public async getCountries(): Promise<void> {
    try {
      this.allCountries = JSON.parse(
        await this.locationService.getAllContries()
      );
    } catch (error) {
      this.frontLogsService.catchProcessError(
        error,
        {
          title: 'Error',
          text: 'Ha ocurrido un error en la consulta de ubicaciones',
          icon: 'error',
        },
        `file: register.component.ts: ~ RegisterComponent ~ getCountries ~ JSON.stringify(error): ${JSON.stringify(
          error
        )}`
      );
    }
  }

  public async countryChange(): Promise<void> {
    try {
      this.state.setValue(null);
      this.city.setValue(null);
      this.allStatesByCountry = null;
      this.allCities = null;
      this.allStatesByCountry = JSON.parse(
        await this.locationService.getAllStatesByCountry(this.country.value)
      );
    } catch (error) {
      this.state.setValue(null);
      this.city.setValue(null);
      this.allStatesByCountry = [];

      this.frontLogsService.catchProcessError(
        error,
        {
          title: 'Error',
          text: 'Ha ocurrido un error en la consulta de ubicaciones',
          icon: 'error',
        },
        `file: register.component.ts: ~ RegisterComponent ~ countryChange ~ JSON.stringify(error): ${JSON.stringify(
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
      this.state.setValue(null);
      this.city.setValue(null);
      this.allCities = [];

      this.frontLogsService.catchProcessError(
        error,
        {
          title: 'Error',
          text: 'Ha ocurrido un error en la consulta de ubicaciones',
          icon: 'error',
        },
        `file: register.component.ts: ~ RegisterComponent ~ stateChange ~ JSON.stringify(error): ${JSON.stringify(
          error
        )}`
      );
    }
  }

  public async probarConexionBot(event: Event): Promise<void> {
    functions.bloquearPantalla(true);
    event.preventDefault();
    if (this.chatId.value && !this.chatId.invalid) {
      await this.telegramLocalService.probarConexionBot(
        this.chatId.value,
        UrlPagesEnum.REGISTER
      );

      functions.bloquearPantalla(false);
    } else {
      alerts.basicAlert('Error', 'Ingrese un Id valido de Telegram', 'error');
      functions.bloquearPantalla(false);
    }
  }

  public tipoDeUsuarios(): string[] {
    return Object.values(UserTypeEnum);
  }

  public infoClik(input: string): void {
    let alertData: { titulo: string; texto: string; icon: SweetAlertIcon };

    switch (input) {
      case 'type':
        alertData = {
          titulo: 'Tipo de cuenta',
          texto: `Ingrese 'Creador' si es creador de contenido, si no ingrese 'Usuario' si desea hacer parte del grupo de un creador de contenido`,
          icon: 'info',
        };
        break;

      case 'chatId':
        alertData = {
          titulo: 'Consultar ID',
          texto: `Ingrese al chat con el bot y escriba el comando '/start' para obtener el id de su chat`,
          icon: 'info',
        };
        break;

      default:
        break;
    }

    alerts.basicAlert(alertData.titulo, alertData.texto, alertData.icon);
  }

  private getUserDocumentTypes(): { value: string; label: string }[] {
    let pairKeyDocumentType: { value: string; label: string }[] = [];

    pairKeyDocumentType.push({
      value: EnumUserDocumentType.CC,
      label: 'Documento Nacional',
    });
    pairKeyDocumentType.push({
      value: EnumUserDocumentType.CE,
      label: 'Identificación Extrangera',
    });
    pairKeyDocumentType.push({
      value: EnumUserDocumentType.PPN,
      label: 'Pasaporte',
    });

    return pairKeyDocumentType;
  }

  private alertPage(): void {
    this.alertsPagesService
      .alertPage(EnumPages.REGISTER)
      .toPromise()
      .then((res: any) => {});
  }
}
