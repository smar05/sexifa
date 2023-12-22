import { functions } from './../../../helpers/functions';
import { ModelsDTO } from './../../../dto/models-dto';
import {
  ActiveModelEnum,
  Imodels,
  ModelsFilterEnum,
} from './../../../interface/imodels';
import { ModelsService } from './../../../services/models.service';
import { IQueryParams } from './../../../interface/i-query-params';
//import { FontAwesomeIconsService } from './../../../shared/font-awesome-icons/font-awesome-icons.service';
import { Icategories } from './../../../interface/icategories';
import { CategoriesService } from './../../../services/categories.service';
import { Component, OnInit } from '@angular/core';
import { QueryFn } from '@angular/fire/compat/firestore';
import { IFireStoreRes } from 'src/app/interface/ifireStoreRes';
import { alerts } from 'src/app/helpers/alerts';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  public categories: Icategories[] | null = [];
  public models: ModelsDTO[] | null = [];
  public search: string = '';
  public pageSize: number = 10; // Tamaño de página: cantidad de documentos por página
  public lastDocument: string; // Último documento de la página anterior
  public load: boolean = false;

  constructor(
    private categoriesService: CategoriesService,
    private modelsService: ModelsService
  ) {}

  async ngOnInit(): Promise<void> {
    //this.getAllCategories();
    functions.bloquearPantalla(true);
    try {
      await this.getAllModels();
    } catch (error) {
      alerts.basicAlert(
        'Error',
        'Ha ocurrido un error en la consulta de modelos',
        'error'
      );
    }
    functions.bloquearPantalla(false);
  }

  public async clickSearch(): Promise<void> {
    try {
      await this.getModelsWhereSearchByName();
    } catch (error) {
      alerts.basicAlert(
        'Error',
        'Ha ocurrido un error en la consulta de modelos pon nombre',
        'error'
      );
    }
  }

  public getAllCategories(): void {
    let queryParams: IQueryParams = {
      orderBy: '"active"',
      equalTo: true,
      print: 'pretty',
    };
    this.categoriesService
      .getData(queryParams)
      .toPromise()
      .then(
        (res: Icategories[]) => {
          this.categories = Object.keys(res).map((a: any) => {
            return {
              id: a,
              icon: res[a].icon,
              name: res[a].name,
            };
          });
        },
        (error) => {
          alerts.basicAlert(
            'Error',
            'Ha ocurrido un error en la consulta de categorias',
            'error'
          );
          console.error(error);
        }
      );
  }

  public async nextPagination(): Promise<void> {
    try {
      if (this.search) {
        await this.getAllModels('search_plus');
      } else {
        await this.getAllModels('plus');
      }
    } catch (error) {
      alerts.basicAlert(
        'Error',
        'Ha ocurrido un error en la consulta de modelos por paginacion',
        'error'
      );
    }
  }

  public async getAllModels(consulta: string = ''): Promise<void> {
    functions.bloquearPantalla(true);
    this.load = true;
    let qr: QueryFn;
    this.search;

    if (consulta == '') {
      qr = (ref) =>
        ref
          .where('active', '==', ActiveModelEnum.ACTIVO)
          .orderBy('name')
          .limit(this.pageSize);
    } else if (consulta == 'plus') {
      qr = (ref) =>
        ref
          .where('active', '==', ActiveModelEnum.ACTIVO)
          .orderBy('name')
          .startAfter(this.lastDocument)
          .limit(this.pageSize);
    } else if (consulta == 'search') {
      this.models = [];
      this.lastDocument = '';

      qr = (ref) =>
        ref
          .where('active', '==', ActiveModelEnum.ACTIVO)
          .where('name', '>=', this.search)
          .where('name', '<=', this.search + '\uf8ff')
          .orderBy('name')
          .orderBy('name')
          .orderBy('name')
          .limit(this.pageSize);
    } else if (consulta == 'search_plus') {
      qr = (ref) =>
        ref
          .where('active', '==', ActiveModelEnum.ACTIVO)
          .where('name', '>=', this.search)
          .where('name', '<=', this.search + '\uf8ff')
          .orderBy('name')
          .startAfter(this.lastDocument)
          .limit(this.pageSize);
    }

    let res: IFireStoreRes[] = null;

    try {
      res = await this.modelsService.getDataFS(qr).toPromise();
    } catch (error) {
      alerts.basicAlert(
        'Error',
        'Ha ocurrido un error en la consulta de modelos',
        'error'
      );
    }
    // Guardar referencia al último documento de la página actual
    if (res.length > 0) {
      this.lastDocument = res[res.length - 1].data.name;
    }

    let imodels: Imodels[] = Object.keys(res).map((a: any) => {
      return {
        id: res[a].id,
        categorie: res[a].data.categorie,
        name: res[a].data.name,
        description: res[a].data.description,
        groupId: res[a].data.groupId,
      };
    });

    //Imodel to DTO
    imodels.forEach(async (imodel: Imodels) => {
      try {
        this.models?.push(await this.modelsService.modelInterfaceToDTO(imodel));
      } catch (error) {
        alerts.basicAlert(
          'Error',
          'Ha ocurrido un error en la conversion de modelos a DTO',
          'error'
        );
      }
    });
    functions.bloquearPantalla(false);
    this.load = false;
  }

  public async getModelsWhereSearchByName(): Promise<void> {
    if (!this.search) {
      this.models = [];
      try {
        await this.getAllModels();
      } catch (error) {
        alerts.basicAlert(
          'Error',
          'Ha ocurrido un error en la consulta de modelos',
          'error'
        );
      }
      return;
    }

    try {
      await this.getAllModels('search');
    } catch (error) {
      alerts.basicAlert(
        'Error',
        'Ha ocurrido un error en la consulta de modelos',
        'error'
      );
    }
  }

  public getUrlModel(model: ModelsDTO) {
    return this.modelsService.getRouterLinkUrl(model);
  }

  capitalizeFirstLetters(text: string): string {
    return functions.capitalizeFirstLetters(text);
  }
}
