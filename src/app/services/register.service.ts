import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { RegisterModel } from '../models/register.model';
import { catchError } from 'rxjs/operators';
import { Users } from '../models/user.model';
import { LoginModel } from '../models/login.model';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient) { }

  baseUrl = "http://localhost:51705/api/Account/";

  httpOptions: Object = {
    headers: new HttpHeaders({
      'Accept': 'text/html',
      'Content-Type': 'application/json',
    }),
    responseType: 'text',
    withCredentials: true
  };

  Register(reg: any): Observable<RegisterModel> {
    return this.http.post<RegisterModel>(this.baseUrl + "Register", JSON.stringify(reg), this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      );
  }

  getAllUsers(): Observable<Users[]> {
    return this.http.get<Users[]>(this.baseUrl + "GetAllUsers")
      .pipe(
        catchError(this.errorHandler)
      );
  }

  UserNameExist(username: string) {
    return this.http.get(this.baseUrl + "UserExists?username=" + username).pipe(catchError(this.errorHandler));
  }

  EmailExist(email: string) {
    return this.http.get(this.baseUrl + "EmailExists?email=" + email).pipe(catchError(this.errorHandler));
  }

  Login(login: LoginModel): Observable<LoginModel> {
    return this.http.post<LoginModel>(this.baseUrl + "Login", login, this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      );
  }

  LogoutUsers() {
    return this.http.get(this.baseUrl + 'Logout', { withCredentials: true }).pipe();
  }

  EmailConfirm(id: string, token: string) {
    return this.http.get(this.baseUrl + 'RegistrationConfirm?ID=' + id + '&Token=' + token).pipe();
  }

  ForgetPassword(email: string) {
    return this.http.get(this.baseUrl + 'ForgetPassword/' + email).pipe();
  }

  errorHandler(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
