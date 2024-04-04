import { Component, Output, EventEmitter, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {

  addNew = true;

  public router = inject(Router);

  @Output() valueChanged = new EventEmitter<string>();
  @Output() availabilityCheck = new EventEmitter<string>();

  emitValue() {
    this.valueChanged.emit('addCar');
  }

  checkAvailability(){
    this.availabilityCheck.emit('lookCars');
  }


  ngOninit(): void {
    this.router.events.subscribe((data) => {
      console.log(data);
      
    })
  }

  goBack(){
    this.router.navigate(['/home']);
  }

}
