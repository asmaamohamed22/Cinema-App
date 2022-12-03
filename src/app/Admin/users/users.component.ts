import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Users } from 'src/app/models/user.model';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: Users[] = null;
  constructor(private service: AdminService, private route:Router) { }

  ngOnInit() {
    this.getUsers();
  }
  getUsers() {
    this.service.GetAllUsers().subscribe((list) => {
     this.users = list;
   }, err => console.log(err));
 }

 EditUser(id:string){
  this.route.navigate(['/edituser', id]);
 }

}
