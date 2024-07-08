import { Component, OnInit } from '@angular/core';
import { LocalStorageEnum } from 'src/app/enum/localStorageEnum';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
})
export class MainPageComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    localStorage.setItem(LocalStorageEnum.SEARCH_ORDER, 'true');
  }
}
