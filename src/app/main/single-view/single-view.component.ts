import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewDidEnter } from '@ionic/angular';
import { AlertController, ToastController } from '@ionic/angular';
import { Directory, Filesystem } from '@capacitor/filesystem';

@Component({
  selector: 'app-single-view',
  templateUrl: './single-view.component.html',
  styleUrls: ['./single-view.component.scss'],
})
export class SingleViewComponent implements ViewDidEnter {
  ionViewDidEnter(): void {
    this.ngOnInit1();
  }

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private aroute = inject(ActivatedRoute);
  private alertController = inject(AlertController);
  private toastController = inject(ToastController);

  carModel: string = '';
  carName: string = '';
  carColor: string = '';
  carNumber: string = '';
  handlerMessage = '';
  roleMessage = '';
  textSearch = true;
  isEditMode = false;
  editId: string = '';

  userForm: any;
  addNew = false;
  orderList: any[] = [];
  vehicleList: any[] = [];
  cars: any[] = [];
  image!: string;
  searchText!: string;
  searchDate!:string;
  allOrders: any[] = [];
  carId!: string;

  ngOnInit1() {
    this.aroute.params.subscribe((params) => {
      this.carNumber = params['id'];
    });
    this.getAllCars();
    this.getAllOrders();
    this.initFormGroup();
  }

  initFormGroup(): void {
    this.userForm = this.fb.group({
      sDate: new FormControl('', [Validators.required]),
      eDate: new FormControl('', [Validators.required]),
      customer: new FormControl('', [Validators.required]),
    });
  }
  getAllCars() {
    this.vehicleList = JSON.parse(localStorage.getItem('myCars') as string)
      ? JSON.parse(localStorage.getItem('myCars') as string)
      : [];
    this.vehicleList.forEach((cars) => {
      if (cars.number == this.carNumber) {
        this.carId = cars.id;
        this.carName = cars.name;
        this.carModel = cars.model;
        this.carColor = cars.color;
      }
    });
  }

  getAllOrders() {
    this.searchText = '';
    this.searchDate = '';
    this.orderList = JSON.parse(
      localStorage.getItem(`${this.carNumber}`) as string
    )
      ? JSON.parse(localStorage.getItem(`${this.carNumber}`) as string)
      : [];

    this.allOrders = this.orderList;
  }

  addNewVehicle() {
    this.addNew = !this.addNew;
    this.isEditMode = false;
    this.editId = '';
    this.userForm.reset();
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
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    if (this.isEditMode) {
      let order = this.orderList.filter((data) => {
        return data.id !== this.editId;
      });

      if (!order) {
        order = [];
      }
      const vehicle = {
        car: this.carId,
        endDate: this.userForm.get('eDate').value,
        startDate: this.userForm.get('sDate').value,
        user: this.userForm.get('customer').value,
        id: this.editId,
      };
      order.push(vehicle);
      localStorage.setItem(`${this.carNumber}`, JSON.stringify(order));
      this.addNewVehicle();
      this.getAllOrders();
      return;
    }

    const orderList = JSON.parse(
      localStorage.getItem(`${this.carNumber}`) as string
    )
      ? JSON.parse(localStorage.getItem(`${this.carNumber}`) as string)
      : [];
    const vehicle = {
      car: this.carId,
      endDate: this.userForm.get('eDate').value,
      startDate: this.userForm.get('sDate').value,
      user: this.userForm.get('customer').value,
      id: orderList.length,
    };
    orderList.push(vehicle);
    localStorage.setItem(`${this.carNumber}`, JSON.stringify(orderList));
    this.addNewVehicle();
    this.getAllOrders();
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  remove(num: string) {
    this.presentAlert(num);
  }

  async presentToast(position: 'top' | 'middle' | 'bottom', mgs: string) {
    const toast = await this.toastController.create({
      message: mgs,
      duration: 1500,
      position: position,
    });

    await toast.present();
  }

  removeCar() {
    if (this.orderList.length) {
      this.presentToast(
        'top',
        'Please Download all the Deals related to this car before deleting this Car.'
      );
      return;
    }
    this.presentAlert();
  }

  search(text: KeyboardEvent) {
    if (!this.searchText) {
      this.orderList = this.allOrders;
      return;
    }
    console.log(this.allOrders);
    
    this.orderList = this.allOrders.filter((data) => {
      const searchText = this.searchText.toLowerCase();
      const car = data?.car ? data.car.toLowerCase() : '';
      const startDate = data?.startDate ? data.startDate.toLowerCase() : '';
      const endDate = data?.endDate ? data.endDate.toLowerCase() : '';
      const user = data?.user ? data.user.toLowerCase() : '';
      if (
        car.includes(searchText) ||
        startDate.includes(searchText) ||
        endDate.includes(searchText) ||
        user.includes(searchText)
      ) {
        return data;
      }
    });
  }

  view() {
    this.router.navigate(['/home/orders', this.carNumber]);
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
            if (!num) {
              const cars = this.vehicleList.filter((car: any) => {
                return car.number !== this.carNumber;
              });

              localStorage.setItem('myCars', JSON.stringify(cars));
              this.presentToast('top', 'Successfully deleted');
              this.router.navigate(['/home']);
            } else {
              let data =this.allOrders.filter((data) => {
                return data.id !== num;
              })          
              localStorage.setItem(`${this.carNumber}`, JSON.stringify(data));
              this.presentToast('top','Successfully deleted');
              this.getAllOrders(); 
            }
          },
        },
      ],
    });

    await alert.present();
  }

  edit(num: string) {
    this.isEditMode = true;
    this.editId = num;
    this.addNew = !this.addNew;
    const order = this.orderList.reverse().filter((data) => {
      return data.id === num;
    });

    this.userForm.patchValue({
      customer: order[0].user,
      sDate: order[0].startDate,
      eDate: order[0].endDate,
    });
  }

  changeSearch() {
    this.textSearch = !this.textSearch;
  }


  onDateChange(event:any){
      this.orderList = JSON.parse(localStorage.getItem(`${this.carNumber}`) as string) ? JSON.parse(localStorage.getItem(`${this.carNumber}`) as string) : [];
     if(!this.searchDate){
      return;
     }
      let searchResult: string[]= []
       if(this.orderList){
         this.orderList.forEach((item:any) => {
           const date2 = new Date(item.endDate);
           const date1 = new Date(item.startDate);
           const searchDate = new Date(this.searchDate);
           if (searchDate >= date1 && searchDate <= date2) {
            searchResult.push(item);
           }
       });
       }
       this.orderList = searchResult;
     }

     async createAndDownloadPDF(){
      await Filesystem.checkPermissions();
      await Filesystem.requestPermissions();
     
      const fileResponseData = 'SGVsbG8sIFdvcmxkIQ=='

      // Save PDF File to Documents Folder in the Phone
      const writePdfFile = await Filesystem.writeFile({
        path: 'report' + Date.now() + ".pdf",
        data: fileResponseData,
        directory: Directory.Documents,
      });
      

    }
  }

