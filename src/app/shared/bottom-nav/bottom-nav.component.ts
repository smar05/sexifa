//import { FontAwesomeIconsService } from './../font-awesome-icons/font-awesome-icons.service';
import { Component, OnInit } from '@angular/core';
import { LocalStorageEnum } from 'src/app/enum/localStorageEnum';

@Component({
  selector: 'app-bottom-nav',
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.css'],
})
export class BottomNavComponent implements OnInit {
  public userType: string = '';

  constructor() {}

  ngOnInit(): void {
    this.userType = localStorage.getItem(LocalStorageEnum.USER_TYPE) || '';
  }
}
