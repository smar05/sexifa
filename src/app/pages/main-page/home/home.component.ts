import { functions } from './../../../helpers/functions';
import { ModelsDTO } from './../../../dto/models-dto';
import { Imodels, ModelsFilterEnum } from './../../../interface/imodels';
import { ModelsService } from './../../../services/models.service';
import { IQueryParams } from './../../../interface/i-query-params';
//import { FontAwesomeIconsService } from './../../../shared/font-awesome-icons/font-awesome-icons.service';
import { Icategories } from './../../../interface/icategories';
import { CategoriesService } from './../../../services/categories.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  public categories: Icategories[] | null = [];
  public models: ModelsDTO[] | null = [];

  constructor(
    private categoriesService: CategoriesService,
    private modelsService: ModelsService
  ) //public fontAwesomeIconsService: FontAwesomeIconsService
  {}

  ngOnInit(): void {
    this.getAllCategories();
    this.getAllModels();
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
          console.error(error);
        }
      );
  }

  public getAllModels(categoria: Icategories = {}): void {
    this.models = [];
    let equalTo: string = `"true_${categoria.id}"`;
    let queryParams: IQueryParams = {
      orderBy: categoria.id
        ? `"filter/${ModelsFilterEnum.active_categorie}"`
        : '"active"',
      equalTo: categoria.id ? equalTo : true,
      print: 'pretty',
    };
    this.modelsService
      .getData(queryParams)
      .toPromise()
      .then(
        async (res: Imodels[]) => {
          let imodels: Imodels[] = Object.keys(res)
            .map((a: any) => {
              return {
                id: a,
                categorie: res[a].categorie,
                name: res[a].name,
                page: res[a].page,
                url: res[a].url,
                description: res[a].description,
              };
            })
            .sort((a: Imodels, b: Imodels) =>
              a.name.toLowerCase()?.localeCompare(b.name.toLowerCase())
            );

          //Imodel to DTO
          imodels.forEach(async (imodel: Imodels) => {
            this.models?.push(
              await this.modelsService.modelInterfaceToDTO(imodel)
            );
          });
        },
        (error) => {
          console.error(error);
        }
      );
  }

  public getUrlModel(model: ModelsDTO) {
    return this.modelsService.getRouterLinkUrl(model);
  }
}
