import { RouterModule } from '@angular/router';
import { SideBarComponent } from './side-bar/side-bar.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BottomNavComponent } from './bottom-nav/bottom-nav.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SkFoldingCubeComponent } from './sk-folding-cube/sk-folding-cube.component';
import { ModelCardsComponent } from './model-cards/model-cards.component';
import { ButtonComponent } from './button/button.component';

@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    SideBarComponent,
    SkFoldingCubeComponent,
    BottomNavComponent,
    ModelCardsComponent,
    ButtonComponent,
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    SideBarComponent,
    SkFoldingCubeComponent,
    BottomNavComponent,
    ModelCardsComponent,
    ButtonComponent,
    //FontAwesomeModule,
  ],
  imports: [CommonModule, RouterModule, FontAwesomeModule],
})
export class SharedModule {}
