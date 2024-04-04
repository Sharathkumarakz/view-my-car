import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MainRoutingModule } from './main-routing.module';
import { HomeComponent } from './home/home.component';
import { VehiclesComponent } from './vehicles/vehicles.component';
import { BookingComponent } from './booking/booking.component';
import { SingleViewComponent } from './single-view/single-view.component';
import { OrdersComponent } from './orders/orders.component';
import { HeaderComponent } from '../layout/header/header.component';


@NgModule({
  declarations: [
    HomeComponent,
    VehiclesComponent,
    BookingComponent,
    SingleViewComponent,
    OrdersComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class MainModule { }
