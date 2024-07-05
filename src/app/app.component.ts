import { Component } from '@angular/core';
import { LocalStorageEnum } from './enum/localStorageEnum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'OnlyGram';

  constructor() {
    localStorage.setItem(LocalStorageEnum.SEARCH_ORDER, 'true');
  }
}
