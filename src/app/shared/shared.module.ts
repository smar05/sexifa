import { RouterModule } from '@angular/router';
import { SideBarComponent } from './side-bar/side-bar.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [NavbarComponent, FooterComponent, SideBarComponent],
  exports: [NavbarComponent, FooterComponent, SideBarComponent],
  imports: [CommonModule, RouterModule],
})
export class SharedModule {}
