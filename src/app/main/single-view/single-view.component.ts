import { Component, OnInit, inject} from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-single-view',
  templateUrl: './single-view.component.html',
  styleUrls: ['./single-view.component.scss'],
})
export class SingleViewComponent  implements OnInit, ViewWillEnter {


  ionViewWillEnter(): void {
    this.ngOnInit();
  }

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private aroute = inject(ActivatedRoute);
  private alertController = inject(AlertController);
  private toastController = inject(ToastController);

  carModel:string = '';
  carName: string = '';
  carColor: string = '';
  carNumber: string = '';
  handlerMessage = '';
  roleMessage = '';
  textSearch = true;

  userForm :any;
  addNew = false;
  orderList: any[] = [];
  vehicleList: any[] = [];
  cars: any[] = [];
  image!: string;
  searchText!:string;
  allOrders: any[] = [];
  carId!:string;

  

  ngOnInit() {
    this.aroute.params.subscribe(params => {
      this.carNumber = params['id'];
    });
    this.getAllCars();
    this.getAllOrders();
    this.initFormGroup();
  }

  initFormGroup(): void { 
    this.userForm = this.fb.group({
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
    this.vehicleList.forEach((cars) => {
            if(cars.number == this.carNumber){
              this.carId = cars.id;
              this.carName = cars.name;
              this.carModel = cars.model;
              this.carColor = cars.color;
          }});
  }


  getAllOrders(){
    this.orderList = JSON.parse(localStorage.getItem(`${this.carNumber}`) as string) ? JSON.parse(localStorage.getItem(`${this.carNumber}`) as string) : [];

    this.orderList.forEach((details,indx) => {
        this.vehicleList.forEach((cars) => {
          if(cars.id == details.car){
            if(cars.number == this.carNumber){
              this.carId = cars.id;    
            }
            this.orderList[indx].car = cars.number;
          }
        })
    })

    this.orderList = this.orderList.filter((data) => {
      return data.car === this.carNumber;
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

    
    
    const orderList = JSON.parse(localStorage.getItem(`${this.carNumber}`) as string) ? JSON.parse(localStorage.getItem(`${this.carNumber}`) as string) : [];
    const vehicle = {
      car: this.carId,
      endDate: this.userForm.get('eDate').value,
      startDate: this.userForm.get('sDate').value,
      user: this.userForm.get('customer').value,
      id: orderList.length
    }
    orderList.push(vehicle);
    localStorage.setItem(`${this.carNumber}`, JSON.stringify(orderList));
    this.addNewVehicle();
    this.getAllOrders();
  }

  goBack(){
    this.router.navigate(['/home']);
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

  removeCar(){
  if(this.orderList.length){
    this.presentToast('top','Please Download all the Deals related to this car before deleting this Car.');
    return;
  }
  this.presentAlert();
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


  view(){
    this.router.navigate(['/home/orders',this.carNumber]);
  }


  async presentAlert(num?: string) {
    const alert = await this.alertController.create({
      header: 'Are you sure to delete?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.handlerMessage = 'Canceled';
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {

            if(!num){
            const cars = this.vehicleList.filter((car:any) => {
              return car.number !== this.carNumber;
            });
        
            localStorage.setItem('myCars', JSON.stringify(cars));
            this.presentToast('top','Successfully deleted');
            this.router.navigate(['/home']);
          } else{
            const cars = this.vehicleList.filter((car:any) => {
              return car.number !== num;
            });
        
            localStorage.setItem('myCars', JSON.stringify(cars));
            this.getAllCars();
            this.presentToast('top','Successfully deleted');
          }
          },
        },
      ],
    });

    await alert.present();
  }
  

  changeSearch(){
    this.textSearch = !this.textSearch;
  }
}
