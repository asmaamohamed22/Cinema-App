import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RegisterService } from '../services/register.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {

  constructor(private service: RegisterService, private route: Router, private auth: AuthService) { }

  ngOnInit() {
    if (this.IsUserRegistered()) {
      if (this.auth.IsExpiredDate(this.auth.expire) === true) {
        this.Logout();
      }

      this.auth.ValidateUser(this.auth.email, this.auth.role)
      .subscribe(
        success=>{
          console.log('user is authorized');
        },
        err=>{
          console.log(err);
          this.Logout();
        }
      );
    }
  }

  // Done
  Logout() {
    this.service.LogoutUsers().subscribe(succ => {
      localStorage.clear();
      console.log('authoization return false');

      this.route.navigate(['home']);
    }, err => console.log((err))
    );
  }

  // Done
  IsUserRegistered() {
    const email = !!localStorage.getItem('email');
    const exp = !!localStorage.getItem('expire');
    const role = !!localStorage.getItem('role');

    if (email && role && exp) {
      return true;
    }
    return false;
  }

  //
}
