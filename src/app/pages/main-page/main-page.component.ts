import { Component, OnInit } from '@angular/core';
import { EnumVariablesGlobales } from 'src/app/enum/enum-variables-globales';
import { VariablesGlobalesService } from 'src/app/services/variables-globales.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
})
export class MainPageComponent implements OnInit {
  constructor(private variablesGlobalesService: VariablesGlobalesService) {}

  ngOnInit(): void {
    this.variablesGlobalesService.set(EnumVariablesGlobales.SEARCH_ORDER, true);
  }
}
