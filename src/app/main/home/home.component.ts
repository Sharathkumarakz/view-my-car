import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ViewDidEnter } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent  implements OnInit, ViewDidEnter {


  private router = inject(Router);
  private fb = inject(FormBuilder);
  

  carForm :any;
  availabilityForm: any;
  addNew = false;
  isAvailabilityCheck = false;
  availableCars:any[]=[];
  


  ionViewDidEnter(): void {
    this.ngOnInit();
    this.availableCars = [];
  }


  checkAvailability(){
    this.isAvailabilityCheck = !this.isAvailabilityCheck;
    this.availableCars = [];
    this.ngOnInit();
  }


  initFormGroup(): void { 
    this.carForm = this.fb.group({
      color: new FormControl('', [
        Validators.required
      ]),
      number: new FormControl('', [
        Validators.required
      ]),
      model: new FormControl('', [
        Validators.required
      ]),
      name: new FormControl('', [
        Validators.required
      ]),
    });

    this.availabilityForm = this.fb.group({
      startDate: new FormControl(''),
      endDate: new FormControl('')
    });
  }

  vehicleList:any;
  
  ngOnInit() {
    this.getAllCars();
    this.getAllCars();
    this.initFormGroup();
  }

  addNewVehicle() {
    this.addNew = !this.addNew
  }

  addVehicleToList() {
    if(this.carForm.invalid){
      this.carForm.markAllAsTouched();
      return;
    }

    const vehicleList = JSON.parse(localStorage.getItem('myCars') as string) ? JSON.parse(localStorage.getItem('myCars') as string) : [];
    const vehicle = {
      color: this.carForm.get('color').value,
      model: this.carForm.get('model').value,
      name: this.carForm.get('name').value,
      number: this.carForm.get('number').value,
      id: vehicleList.length
    }

   
    vehicleList.push(vehicle);
    localStorage.setItem('myCars', JSON.stringify(vehicleList));
    this.addNewVehicle();
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

  lookCars(){

    this.availableCars = [];

    const orderList = JSON.parse(localStorage.getItem('orders') as string) ? JSON.parse(localStorage.getItem('orders') as string) : [];

    if(!orderList){
      this.availableCars = this.vehicleList;
      return;
    } else if(!this.availabilityForm.get('startDate').value && !this.availabilityForm.get('endDate').value){
      return
    }

    orderList.forEach((item:any) => {
        const unAvailableCars:string[] = [];
        const date2 = new Date(item.endDate);
        const date1 = new Date(item.startDate);
        const givenDate1Obj = new Date(this.availabilityForm.get('startDate').value ? this.availabilityForm.get('startDate').value : this.availabilityForm.get('endDate').value);
        const givenDate2Obj = new Date(this.availabilityForm.get('endDate').value ? this.availabilityForm.get('endDate').value :this.availabilityForm.get('startDate').value);
        if ((givenDate1Obj < date1 && givenDate2Obj < date1) || (givenDate1Obj > date2 && givenDate2Obj > date2)) {
        } else {
          unAvailableCars.push(item.car);
        }

        this.vehicleList.forEach((data:any) => {
       
          if(!unAvailableCars.includes(data.id)){
            this.availableCars.push(data);
          }
          console.log(this.availableCars);
          
        })
    });
  }
}
