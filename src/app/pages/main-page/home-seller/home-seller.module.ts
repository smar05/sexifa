import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { HomeSellerComponent } from './home-seller.component';
import { HomeSellerRoutingModule } from './home-seller-routing.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [HomeSellerComponent],
  imports: [
    CommonModule,
    HomeSellerRoutingModule,
    SharedModule,
    MatTableModule,
    MatPaginatorModule,
  ],
})
export class HomeSellerModule {}
