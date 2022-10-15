import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CryptService } from './crypt.service';
import { RegisterService } from './register.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  email: string;
  expire: string;
  role: string;

  constructor(private service: CryptService, private http: HttpClient) { 
    if (this.IsUserRegistered()) {
      this.expire = this.service.Decrypt(localStorage.getItem('expire'));
      this.email = this.service.Decrypt(localStorage.getItem('email'));
      this.role = this.service.Decrypt(localStorage.getItem('role'));
    }
  }

  async installStorage(remember: boolean, email: string){
    const day = new Date();
    if (remember) {
      day.setDate(day.getDay() + 10);
    }
    else {
      day.setMinutes(day.getMinutes() + 30);
    }

    localStorage.setItem('email', this.service.Encrypt(email));
    localStorage.setItem('expire', this.service.Encrypt(day.toString()));

    this.GetRoleName(email).subscribe(success => {
      localStorage.setItem('role', this.service.Encrypt(success));
    }, e => console.log(e));
  }

  // Done
  IsExpiredDate(day: string) {
    const dateNow = new Date();
    const dateExpire = new Date(Date.parse(day));
    if (dateExpire < dateNow) {
      return true;
    }
    return false;
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

  // Done
  GetRoleName(email: string) {
    return this.http.get('http://localhost:51705/api/Account/GetRoleName/' + email, {responseType: 'text'}).pipe();
  }

  // Done
  ValidateUser(email: string, role: string) {
    return this.http.get('http://localhost:51705/api/Account/CheckUserClaims/'+ email + '&' + role, { withCredentials: true }).pipe();
  }

}
