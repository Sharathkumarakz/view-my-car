import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StarterRoutingModule } from './starter-routing.module';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';


@NgModule({
  declarations: [
    WelcomePageComponent
  ],
  imports: [
    CommonModule,
    StarterRoutingModule
  ]
})
export class StarterModule { }
