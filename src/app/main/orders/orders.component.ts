import { Component, OnInit, inject} from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';
import jsPDF from 'jspdf';
 
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit, ViewWillEnter {


  ionViewWillEnter(): void {
    this.ngOnInit();
  }

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private aroute = inject(ActivatedRoute);

  carModel:string = '';
  carName: string = '';
  carColor: string = '';
  carNumber: string = '';
  resetData: any;

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
    this.orderList = JSON.parse(localStorage.getItem('orders') as string) ? JSON.parse(localStorage.getItem('orders') as string) : [];
    console.log(this.orderList);
    
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
    this.resetData = this.orderList.filter((data) => {
      return data.car !== this.carNumber;
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


  downloadAsPDF() {
    
    if(!this.orderList.length){
      return;
    }

    const doc = new jsPDF();
    const startY = 10;
    const lineHeight = 7;
    const cellPadding = 10; // Adjust for desired padding
 
    // Document properties (consider including more details if relevant)
    doc.setProperties({
      title: 'Your Document Title', // Replace with your desired title
      author: 'Your Name', // Replace with your name or organization
    });
 
    // Centering calculations (assuming all columns have same width)
    const pageWidth = doc.internal.pageSize.getWidth();
    const tableWidth = (10 + (2 * cellPadding)) * 3; // Assuming 3 columns, adjust if needed
    const tableOffsetX = (pageWidth - tableWidth) / 2;
 
    // Font settings
    doc.setFont('helvetica');
    doc.setFontSize(12);
 
    // Heading (larger font size and centered)
    const headingFontSize = 16;
    const date = new Date(Date.now());
 
// Define the formatting options with type assertions
const options: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
 
};
 
const humanReadableDate: string = date.toLocaleDateString('en-US', options);
console.log(humanReadableDate);
    const headingY = startY + (headingFontSize / 2); // Adjust Y position for centering
    doc.setFontSize(headingFontSize);
    doc.text( `${humanReadableDate} - Report`, tableOffsetX + (tableWidth / 2), headingY, { align: 'center' }); // Center-aligned heading
 
    // Table headers
    const headerX = [
      tableOffsetX + 2 - 10,
      tableOffsetX + 2 + (tableOffsetX/2),
      tableOffsetX + 2 + tableOffsetX + 8,
    ];
    doc.text('Name', headerX[0], startY + headingFontSize + lineHeight );
    doc.text('Date1', headerX[1], startY + headingFontSize + lineHeight);
    doc.text('Date2', headerX[2], startY + headingFontSize + lineHeight);
 
    // Set the data rows
    this.orderList.forEach((item: any,index:number) => {
      doc.text(item.user, headerX[0], startY + headingFontSize + lineHeight + 10 +(index*10));
      doc.text(item.startDate, headerX[1], startY + headingFontSize + lineHeight + 10 +(index*10))
      doc.text(item.endDate, headerX[2], startY + headingFontSize + lineHeight + 10 +(index*10))
    });
    // Save the PDF
    doc.save(`report.pdf`);
    localStorage.setItem('orders', JSON.stringify(this.resetData));
    this.getAllOrders();
}
}
