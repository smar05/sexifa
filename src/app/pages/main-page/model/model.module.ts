import { ModelComponent } from './model.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModelRoutingModule } from './model-routing.module';

@NgModule({
  declarations: [ModelComponent],
  imports: [CommonModule, ModelRoutingModule, FontAwesomeModule],
})
export class ModelModule {}
