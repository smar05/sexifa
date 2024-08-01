//import { FontAwesomeIconsService } from './../font-awesome-icons/font-awesome-icons.service';
import { Component, OnInit } from '@angular/core';
import { EnumVariablesGlobales } from 'src/app/enum/enum-variables-globales';
import { VariablesGlobalesService } from 'src/app/services/variables-globales.service';

@Component({
  selector: 'app-bottom-nav',
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.css'],
})
export class BottomNavComponent implements OnInit {
  public userType: string = '';

  constructor(private variablesGlobalesService: VariablesGlobalesService) {}

  ngOnInit(): void {
    this.variablesGlobalesService
      .getVariable(EnumVariablesGlobales.USER_TYPE)
      .subscribe((res: string) => {
        this.userType = res || '';
      });
  }
}
