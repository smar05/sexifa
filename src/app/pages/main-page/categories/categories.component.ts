//import { FontAwesomeIconsService } from './../../../shared/font-awesome-icons/font-awesome-icons.service';
import { CategoriesService } from './../../../services/categories.service';
import { Icategories } from './../../../interface/icategories';
import { Component, OnInit } from '@angular/core';
import { alerts } from 'src/app/helpers/alerts';
import { IFrontLogs } from 'src/app/interface/i-front-logs';
import { LocalStorageEnum } from 'src/app/enum/localStorageEnum';
import { FrontLogsService } from 'src/app/services/front-logs.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
  public categories: Icategories[] | null = [];

  constructor(
    private categoriesService: CategoriesService, //public fontAwesomeIconsService: FontAwesomeIconsService
    private frontLogsService: FrontLogsService
  ) {}

  ngOnInit(): void {
    this.getAllCategories();
  }

  public getAllCategories(): void {
    this.categoriesService
      .getData()
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
            userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
            log: `file: categories.component.ts: ~ CategoriesComponent ~ getAllCategories ~ JSON.stringify(error): ${JSON.stringify(
              error
            )}`,
          };

          this.frontLogsService
            .postDataFS(data)
            .then((res) => {})
            .catch((err) => {
              alerts.basicAlert('Error', 'Error', 'error');
            });
        }
      );
  }
}
