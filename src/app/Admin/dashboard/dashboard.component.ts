import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  isUserList: boolean = false;
  isAddUser: boolean = false;
  constructor() { }

  ngOnInit() {
    $(function () {
      $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
      });
    });
  }
  CheckUser(): boolean {
    this.DisableLists();
    return this.isUserList = true;
  }

  AddUser() {
    this.DisableLists();
    return this.isAddUser = true;
  }

  DisableLists() {
    this.isAddUser = false;
    this.isUserList = false;
  }

}
