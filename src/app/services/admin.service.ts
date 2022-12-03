import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Users } from '../models/user.model';
import { UserModel } from '../models/userModel';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  baseUrl = "http://localhost:51705/api/Admin/";

  httpOptions: Object = {
    headers: new HttpHeaders({
      'Accept': 'text/html',
      'Content-Type': 'application/json',
    }),
    responseType: 'text',
    withCredentials: true
  };
 Options: Object = {
    headers: new HttpHeaders({
      'Accept': 'text/html',
      'Content-Type': 'application/json',
    }),
  };

  GetAllUsers(): Observable<Users[]> {
    return this.http.get<Users[]>(this.baseUrl + "GetAllUsers")
      .pipe(
        catchError(this.errorHandler)
      );
  }

  AddUser(model:UserModel): Observable<UserModel> {
    return this.http.post<UserModel>(this.baseUrl + "AddUser",model, this.Options)
      .pipe(
        catchError(this.errorHandler)
      );
  }

  GetUser(id:string): Observable<Users> {
    return this.http.get<Users>(this.baseUrl + "GetUser/" + id, this.Options)
    .pipe(
      catchError(this.errorHandler)
    );
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
