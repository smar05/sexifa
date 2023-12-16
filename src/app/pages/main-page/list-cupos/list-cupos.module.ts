import { ListCuposComponent } from './list-cupos.component';
//import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { ListCuposRoutingModule } from './list-cupos-routing.module';

@NgModule({
  declarations: [ListCuposComponent],
  imports: [
    CommonModule,
    ListCuposRoutingModule,
    //FontAwesomeModule,
    SharedModule,
  ],
})
export class ListCuposModule {}
