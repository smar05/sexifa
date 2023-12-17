import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserSellerComponent } from './user-seller.component';
import { UserSellerRoutingModule } from './user-seller-routing.module';

@NgModule({
  declarations: [UserSellerComponent],
  imports: [
    CommonModule,
    UserSellerRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class UserSellerModule {}
