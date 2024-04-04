import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ViewDidEnter } from '@ionic/angular';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent  implements OnInit, ViewDidEnter {


  private router = inject(Router);
  private fb = inject(FormBuilder);
  private alertController = inject(AlertController);
  private toastController = inject(ToastController);

  
  selectedCar:any = null;
  orderList:any[] = [];
  allOrders:any[] = [];

  carForm :any;
  availabilityForm: any;
  addNew = false;
  isAvailabilityCheck = false;
  availableCars:any[]=[];
  splitValue : number =0;


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
    this.initFormGroup();
    this.carSelection();
    // this.getAllOrders();
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
    this.ionViewDidEnter();
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
    if(!num){
      return;
    }
    this.router.navigate(['/home/view',num]);
  }

  

  lookCars(){

    this.availableCars = [];
    if(!this.availabilityForm.get('startDate').value && !this.availabilityForm.get('endDate').value){
      return
    }

    if(!this.vehicleList){
      return;
    }
    const unAvailableCars:string[] = [];
    this.vehicleList.forEach((data:any) => {

     const orderList = JSON.parse(localStorage.getItem(`${data.number}`) as string) ? JSON.parse(localStorage.getItem(`${data.number}`) as string) : [];
      if(orderList){
        orderList.forEach((item:any) => {
          const date2 = new Date(item.endDate);
          const date1 = new Date(item.startDate);
          const givenDate1Obj = new Date(this.availabilityForm.get('startDate').value ? this.availabilityForm.get('startDate').value : this.availabilityForm.get('endDate').value);
          const givenDate2Obj = new Date(this.availabilityForm.get('endDate').value ? this.availabilityForm.get('endDate').value :this.availabilityForm.get('startDate').value);
          if ((givenDate1Obj >= date1 && givenDate2Obj >= date1) && (givenDate1Obj <= date2 && givenDate2Obj <= date2)) {
          } else {
            unAvailableCars.push(item.car);
          }
  
        });
      }
    })
    
      this.vehicleList.forEach((data:any) => {
        if(!unAvailableCars.includes(data.id)){
          this.availableCars.push(data);
        }
      })
    if(!this.availableCars.length){
      this.availableCars = this.vehicleList;
      return;
  }
}




  carSelection(item?:any){
    if(!item){
      this.selectedCar = this.vehicleList[this.vehicleList.length-1];
    } else {
      this.selectedCar = item;
    }
    this.orderList = JSON.parse(localStorage.getItem(`${this.selectedCar.number}`) as string) ? JSON.parse(localStorage.getItem(`${this.selectedCar.number}`) as string) : [];
    this.splitValue = this.orderList.length >= 10 ? 10 : this.orderList.length;
    this.allOrders = this.orderList;
  }

  remove(num:string){
    this.presentAlert(num);
  }

  async presentToast(position: 'top' | 'middle' | 'bottom',mgs:string) {
    const toast = await this.toastController.create({
      message: mgs,
      duration: 1500,
      position: position,
    });

    await toast.present();
  }


  async presentAlert(num?: string) {
    const alert = await this.alertController.create({
      header: 'Are you sure to delete?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {

          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            let data =this.allOrders.filter((data) => {
              return data.id !== num;
            })          
            localStorage.setItem(`${this.selectedCar.number}`, JSON.stringify(data));
            this.presentToast('top','Successfully deleted');
            this.orderList = JSON.parse(localStorage.getItem(`${this.selectedCar.number}`) as string) ? JSON.parse(localStorage.getItem(`${this.selectedCar.number}`) as string) : [];
            this.splitValue = this.orderList.length >= 10 ? 10 : this.orderList.length;
            this.allOrders = this.orderList;
          },
        },
      ],
    });

    await alert.present();
  }

  addNewEvent(value: string) {
    this.addNew = !this.addNew
  }
}
