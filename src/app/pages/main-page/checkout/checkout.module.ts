import { CheckoutComponent } from './checkout.component';
//import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { CheckoutRoutingModule } from './checkout-routing.module';

@NgModule({
  declarations: [CheckoutComponent],
  imports: [
    CommonModule,
    CheckoutRoutingModule,
    //FontAwesomeModule,
    SharedModule,
  ],
})
export class CheckoutModule {}
