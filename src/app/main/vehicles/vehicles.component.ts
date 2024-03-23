import { Component, OnInit, inject} from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss'],
})
export class VehiclesComponent implements OnInit {

  private router = inject(Router);
  private fb = inject(FormBuilder);
  

  carForm :any;
  addNew = false;
  vehicleList: any[] = [];
  cars: any[] = [];
  image!: string;
  allCars: any[] = [];
  searchText!:string;


  ngOnInit() {
    this.getAllCars();
    this.initFormGroup();
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
  }


  getAllCars(){
    this.vehicleList = JSON.parse(localStorage.getItem('myCars') as string) ? JSON.parse(localStorage.getItem('myCars') as string) : [];
    
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

  addVehicleToList() {
    if(this.carForm.invalid){
      this.carForm.markAllAsTouched();
      return;
    }

    const vehicleList = JSON.parse(localStorage.getItem('myCars') as string) ? JSON.parse(localStorage.getItem('myCars') as string) : [];
    const vehicle = {
      image: this.image,
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

  goBack(){
    this.router.navigate(['/home']);
  }

  remove(num:string){

    const cars = this.vehicleList.filter((car:any) => {
      return car.number !== num;
    });

    localStorage.setItem('myCars', JSON.stringify(cars));
    this.getAllCars();
  }


  search(text:KeyboardEvent){
    if(!this.searchText){
      this.getAllCars()
      return;
    }
    this.vehicleList = this.allCars.filter((data) => {
        if(data?.color?.includes(this.searchText) || data?.name?.includes(this.searchText) || data?.model?.includes(this.searchText) || data?.number?.includes(this.searchText)){
          return data;
        }
     })
  }

}
