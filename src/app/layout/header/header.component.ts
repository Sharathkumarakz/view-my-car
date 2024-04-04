import { Component, Output, EventEmitter, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {

  addNew = true;

  private router = inject(Router);

  @Output() valueChanged = new EventEmitter<string>();
  @Output() availabilityCheck = new EventEmitter<string>();

  emitValue() {
    this.valueChanged.emit('addCar');
  }

  checkAvailability(){
    this.availabilityCheck.emit('lookCars');
  }


  ionViewWillEnter(): void {
    console.log(this.router.url);
  }

  goBack(){
    this.router.navigate(['/home']);
  }

}
