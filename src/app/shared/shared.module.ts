import { RouterModule } from '@angular/router';
import { SideBarComponent } from './side-bar/side-bar.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkFoldingCubeComponent } from './spinners/sk-folding-cube/sk-folding-cube.component';
import { BottomNavComponent } from './bottom-nav/bottom-nav.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    SideBarComponent,
    SkFoldingCubeComponent,
    BottomNavComponent,
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    SideBarComponent,
    SkFoldingCubeComponent,
    BottomNavComponent,
    FontAwesomeModule,
  ],
  imports: [CommonModule, RouterModule, FontAwesomeModule],
})
export class SharedModule {}
