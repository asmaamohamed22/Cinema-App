import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Users } from 'src/app/models/user.model';
import { UserModel } from 'src/app/models/userModel';
import { AdminService } from 'src/app/services/admin.service';
import { CustomvalidationService } from 'src/app/services/customvalidation.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  userForm: FormGroup;
  submitted = false;
  message: string = '';
  errorMsg : string = '';
  isbusy: boolean;
  user:UserModel;
  users:Users[] = [];
  userData : Users;
  title: string;
  btnTitle:string;
  isEditMode:boolean;

  constructor(
    private fb: FormBuilder,
    private activateRoute: ActivatedRoute,
    private service: AdminService,
    private customValidator: CustomvalidationService){ }


    messageValidate = {
    userName: {
      required: 'Username is Required',
      matchUserName: 'Username is already used',
    },
    email: {
      required: 'Email is required',
      notValid: 'Email is Invalid',
      matchEmail: 'Email is already used'
    },
    phoneNumber: {
      required: 'PhoneNumber is required',
      notValid: 'PhoneNumber is Invalid',
      matchEmail: ''
    },
    pass: {
      required: 'Password is Required',
      minLength: 'Password shoud Minimun length 8',
      notMatch: 'password shoud have all type of characters',
    },
    passConfirm: {
      required: 'Confirm Password is Required',
      minLength: 'Password shoud Minimun length 8',
      isMatch: 'Passwords not math'
    }
  };

  ngOnInit() {
    this.isbusy = false;
    this.message = '';
    this.errorMsg = null;
    this.title = 'Add New User';
    this.btnTitle = 'Add User';
    this.userData = null;
    this.isEditMode = false;
    this.user = {
      userName:'',
      email:'',
      password:'',
      emailConfirmed: false,
      phoneNumber:null,
    }

    this.userForm = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      emailConfirmed: false,
      password: ['', Validators.compose([Validators.required, Validators.minLength(8), this.customValidator.patternValidator()])],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
    },
      {
        validator: this.customValidator.MatchPassword('password', 'confirmPassword'),
      }
    );

    this.GetAllUsers();

    this.activateRoute.paramMap.subscribe(
      param=>{
      var id = param.get('id');
      if (id) {
       alert(id)
       this.service.GetUser(id).subscribe(x=>{
        this.userData =x;
        this.title = 'Edit User ';
        this.btnTitle = 'Edit User';
        this.isEditMode = true;
        this.AddUserData();
       }, ex=> console.log(ex));
      }
    });


    this.userForm.valueChanges.subscribe(x => {
      if (this.userForm.status == 'VALID') {
        this.isbusy = true;
      }
    }, ex => console.log(ex))
  }


  AddUserData() {
    if (this.userData !== null) {
      this.userForm.setValue({
        userName: this.userData.userName,
        email: this.userData.email,
        password: this.userData.passwordHash,
        confirmPassword: this.userData.passwordHash,
        emailConfirmed: this.userData.emailConfirmed,
        phoneNumber: this.userData.phoneNumber
      });
    }
  }

  AddUser(){
    if (this.userForm.valid) {
      if (!this.isEditMode) {
      this.user.emailConfirmed = this.userForm.value.emailConfirmed;
      this.user.phoneNumber = this.userForm.value.phoneNumber;
      this.user.password = this.userForm.value.password;
      this.user.userName = this.userForm.value.userName;
      this.user.email = this.userForm.value.email;

      this.service.AddUser(this.user).subscribe(
      succ =>{
        this.ngOnInit();
        this.message = 'User Added Successfully';
      },
      ex => this.errorMsg = ex);
      } else{
        
      }
   }
  }

  isUserNameExist() {
    var name = this.userForm.value.userName;
    if (name !== null && name !== '') {
      for (const user of this.users.values()) {
        if (user.userName === name && !this.isEditMode) {
          return true;
        }
        else if (this.isEditMode && user.userName === name && user.id !== this.userData.id) {
          return true;
        }
      }
    }
    return false;
  }

  isEmailExist() {
    var email = this.userForm.value.email;
    if (email !== null && email !== '') {
      for (const item of this.users.values()) {
        if (item.email === email && !this.isEditMode) {
          return true;
        }
        else if (this.isEditMode && item.email === email && item.id !== this.userData.id) {
          return true;
        }
      }
    }
    return false;
  }

  GetAllUsers() {
    this.service.GetAllUsers().subscribe((list) => {
      this.users = list;
    }, ex => console.log(ex));
  }

}
