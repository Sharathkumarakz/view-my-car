import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss'],
})
export class WelcomePageComponent  implements OnInit {

  private router = inject(Router);

  ngOnInit() {}

  navigateToHome(){
  this.router.navigate(['/home']);
  }

}
