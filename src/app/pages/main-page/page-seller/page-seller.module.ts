import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { PageSellerComponent } from './page-seller.component';
import { PageSellerRoutingModule } from './page-seller-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxSummernoteModule } from 'ngx-summernote';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [PageSellerComponent],
  imports: [
    CommonModule,
    PageSellerRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgxDropzoneModule,
    NgxSummernoteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatChipsModule,
    MatIconModule,
  ],
})
export class PageSellerModule {}
