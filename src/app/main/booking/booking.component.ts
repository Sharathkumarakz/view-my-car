import { Component, OnInit, inject} from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
})
export class BookingComponent  implements OnInit {

  private router = inject(Router);
  private fb = inject(FormBuilder);

  

  userForm :any;
  addNew = false;
  orderList: any[] = [];
  vehicleList: any[] = [];
  cars: any[] = [];
  image!: string;
  searchText!:string;
  allOrders: any[] = [];

  ngOnInit() {
    this.getAllCars();
    this.getAllOrders();
    this.initFormGroup();
  }

  initFormGroup(): void { 
    this.userForm = this.fb.group({
      car: new FormControl('', [
        Validators.required
      ]),
      sDate: new FormControl('', [
        Validators.required
      ]),
      eDate: new FormControl('', [
        Validators.required
      ]),
      customer: new FormControl('', [
        Validators.required
      ]),
    });
  }
  getAllCars(){
    this.vehicleList = JSON.parse(localStorage.getItem('myCars') as string) ? JSON.parse(localStorage.getItem('myCars') as string) : [];
  }


  getAllOrders(){
    this.orderList = JSON.parse(localStorage.getItem('orders') as string) ? JSON.parse(localStorage.getItem('orders') as string) : [];

    this.orderList.forEach((details,indx) => {
        this.vehicleList.forEach((cars) => {
          if(cars.id == details.car){
            this.orderList[indx].car = cars.number;
          }
        })
    })
    this.allOrders = this.orderList;
  }


  addNewVehicle() {
    this.addNew = !this.addNew
  }

  onFileSelected(event: any) {
    var file = event.target!.files[0];
    var reader = new FileReader();
    reader.onload = (e) => {
      var dataUrl = e.target!.result;
      this.image = dataUrl as string;
    };
    reader.readAsDataURL(file);
  }

  addOrder() {
    if(this.userForm.invalid){
      this.userForm.markAllAsTouched();
      return;
    }

    if(this.userForm.get('car').value === 'id'){
      this.userForm.markAllAsTouched();
      return; 
    }

    const vehicle = {
      car: this.userForm.get('car').value,
      endDate: this.userForm.get('eDate').value,
      startDate: this.userForm.get('sDate').value,
      user: this.userForm.get('customer').value,
    }

   
    const orderList = JSON.parse(localStorage.getItem('orders') as string) ? JSON.parse(localStorage.getItem('orders') as string) : [];
    orderList.push(vehicle);
    try {
      localStorage.setItem('orders', JSON.stringify(orderList));
      this.addNewVehicle();
      this.getAllOrders();
    this.presentToast('top','Successfully Added');

    } catch (error) {
    this.presentToast('top',"Can't store more");
      
    }
   
  }

  goBack(){
    this.router.navigate(['/home']);
  }

  handlerMessage = '';
  roleMessage = '';

  constructor(private alertController: AlertController,private toastController: ToastController) {}

  async presentAlert(num:string) {
    const alert = await this.alertController.create({
      header: 'Are you sure to delete?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.handlerMessage = 'Alert canceled';
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.remove(num);
          },
        },
      ],
    });

    await alert.present();
  }


  //toaster
  async presentToast(position: 'top' | 'middle' | 'bottom',mgs:string) {
    const toast = await this.toastController.create({
      message: mgs,
      duration: 1500,
      position: position,
    });

    await toast.present();
  }

  remove(num:string){

    const cars = this.orderList.filter((car:any) => {
      return car.number !== num;
    });

    localStorage.setItem('orders', JSON.stringify(cars));
    this.getAllOrders();
    this.presentToast('top','Successfully removed');
  }


  search(text:KeyboardEvent){
    if(!this.searchText){
      this.orderList = this.allOrders;
      return;
    }
    this.orderList = this.allOrders.filter((data) => {
        if(data?.car?.includes(this.searchText) || data?.startDate?.includes(this.searchText) || data?.endDate?.includes(this.searchText) || data?.user?.includes(this.searchText)){
          return data;
        }
     })
  }
}
