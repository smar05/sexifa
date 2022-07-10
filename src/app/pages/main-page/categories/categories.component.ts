import { FontAwesomeIconsService } from './../../../shared/font-awesome-icons/font-awesome-icons.service';
import { CategoriesService } from './../../../services/categories.service';
import { Icategories } from './../../../interface/icategories';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
  public categories: Icategories[] | null = [];

  constructor(
    private categoriesService: CategoriesService,
    public fontAwesomeIconsService: FontAwesomeIconsService
  ) {}

  ngOnInit(): void {
    this.getAllCategories();
  }

  public getAllCategories(): void {
    this.categoriesService.getData().subscribe(
      (res: Icategories[]) => {
        this.categories = res;
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
