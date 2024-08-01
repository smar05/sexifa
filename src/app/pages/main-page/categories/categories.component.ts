//import { FontAwesomeIconsService } from './../../../shared/font-awesome-icons/font-awesome-icons.service';
import { CategoriesService } from './../../../services/categories.service';
import { Icategories } from './../../../interface/icategories';
import { Component, OnInit } from '@angular/core';
import { alerts } from 'src/app/helpers/alerts';
import { IFrontLogs } from 'src/app/interface/i-front-logs';
import { FrontLogsService } from 'src/app/services/front-logs.service';
import { AlertsPagesService } from 'src/app/services/alerts-page.service';
import { EnumPages } from 'src/app/enum/enum-pages';
import { VariablesGlobalesService } from 'src/app/services/variables-globales.service';
import { EnumVariablesGlobales } from 'src/app/enum/enum-variables-globales';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
  public categories: Icategories[] | null = [];

  constructor(
    private categoriesService: CategoriesService, //public fontAwesomeIconsService: FontAwesomeIconsService
    private frontLogsService: FrontLogsService,
    private alertsPagesService: AlertsPagesService,
    private variablesGlobalesService: VariablesGlobalesService
  ) {}

  ngOnInit(): void {
    this.alertPage();
    this.getAllCategories();
  }

  public getAllCategories(): void {
    this.categoriesService
      .getDataFS()
      .toPromise()
      .then(
        (res: Icategories[]) => {
          this.categories = res;
        },
        (error) => {
          alerts.basicAlert(
            'Error',
            'Ha ocurrido un error en la consulta de categorias',
            'error'
          );
          console.error(error);

          let data: IFrontLogs = {
            date: new Date(),
            userId: this.variablesGlobalesService.getCurrentValue(
              EnumVariablesGlobales.USER_ID
            ),
            log: `file: categories.component.ts: ~ CategoriesComponent ~ getAllCategories ~ JSON.stringify(error): ${JSON.stringify(
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

  private alertPage(): void {
    this.alertsPagesService
      .alertPage(EnumPages.CATEGORIES)
      .toPromise()
      .then((res: any) => {});
  }
}
