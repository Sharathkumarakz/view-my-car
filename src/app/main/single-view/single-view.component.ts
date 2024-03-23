import { Component, OnInit, inject} from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';

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

  

  userForm :any;
  addNew = false;
  orderList: any[] = [];
  vehicleList: any[] = [];
  cars: any[] = [];
  image!: string;
  searchText!:string;
  allOrders: any[] = [];
  carNumber!:string;
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
  }


  getAllOrders(){
    this.orderList = JSON.parse(localStorage.getItem('orders') as string) ? JSON.parse(localStorage.getItem('orders') as string) : [];

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

    const vehicle = {
      car: this.carId,
      endDate: this.userForm.get('eDate').value,
      startDate: this.userForm.get('sDate').value,
      user: this.userForm.get('customer').value,
    }

   
    const orderList = JSON.parse(localStorage.getItem('orders') as string) ? JSON.parse(localStorage.getItem('orders') as string) : [];
    orderList.push(vehicle);
    localStorage.setItem('orders', JSON.stringify(orderList));
    this.addNewVehicle();
    this.getAllOrders();
  }

  goBack(){
    this.router.navigate(['/home']);
  }

  remove(num:string){

    const cars = this.orderList.filter((car:any) => {
      return car.number !== num;
    });

    localStorage.setItem('orders', JSON.stringify(cars));
    this.getAllOrders();
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
