import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ViewDidEnter } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent  implements OnInit, ViewDidEnter {



  ionViewDidEnter(): void {
    this.ngOnInit();
  }

  private router = inject(Router);
  
  vehicleList:any;
  
  ngOnInit() {
    this.getAllCars();
  }

  getAllCars(){
    this.vehicleList = JSON.parse(localStorage.getItem('myCars') as string) ? JSON.parse(localStorage.getItem('myCars') as string) : [];
  }


  navigateTovehicles(){
    this.router.navigate(['/home/vehicles']);
  }

  navigateToBooking(){
    this.router.navigate(['/home/booking']);
  }

  view(num:string){
    this.router.navigate(['/home/view',num]);
  }
}
