import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { VehiclesComponent } from './vehicles/vehicles.component';
import { BookingComponent } from './booking/booking.component';
import { SingleViewComponent } from './single-view/single-view.component';
import { OrdersComponent } from './orders/orders.component';

const routes: Routes = [
  {path: '', component:HomeComponent},
  {path: 'vehicles', component:VehiclesComponent},
  {path: 'booking', component:BookingComponent},
  {path: 'view/:id', component:SingleViewComponent},
  {path: 'orders/:id', component:OrdersComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
