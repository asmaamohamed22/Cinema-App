import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterModel } from 'src/app/models/register.model';
import { Users } from 'src/app/models/user.model';
import { CustomvalidationService } from 'src/app/services/customvalidation.service';
import { RegisterService } from 'src/app/services/register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {


  registermodel: RegisterModel;
  userForm: FormGroup;
  submitted = false;
  alert: boolean = false;
  isbusy: boolean;
  message: string;

  messageValidate = {
    userName: {
      required: 'Username is Required',
      matchUserName: '',
    },
    email: {
      required: 'Email is required',
      notValid: 'Email is Invalid',
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

  constructor(private fb: FormBuilder, private service: RegisterService, private customValidator: CustomvalidationService) { }

  ngOnInit() {
    this.isbusy =false;
    this.userForm = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8), this.customValidator.patternValidator()])],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
    },
      {
        validator: this.customValidator.MatchPassword('password', 'confirmPassword'),
      }
    );

    this.userForm.valueChanges.subscribe(x => {
      if (this.userForm.status == 'VALID') {
        this.isbusy = true;
      }
    }, ex => console.log(ex))
  }

  get registerFormControl() {
    return this.userForm.controls;
  }


  register() {
    this.submitted = true;
    if (this.userForm.valid) {
      this.service.Register(this.userForm.value).subscribe(
        (success) => {
          this.alert = true;
          this.userForm.reset();
        },
        (error) => {
          console.log(error)
        }
      )
    };
  }

  closeAlert() {
    this.alert = false;
  }

  isUserNameExist() {
    const name = this.userForm.value.userName;
    if (name != null && name != '' && this.isbusy === false) {
      this.service.UserNameExist(name).subscribe(x => {
        this.messageValidate.userName.matchUserName = 'Username is already used';
      }, ex => console.log(ex));
      return true;
    } else {
      this.messageValidate.userName.matchUserName = null;
    }
    return false;
  }

  isEmailExist() {
    const email = this.userForm.value.email;
    if (email != null && email != '' && this.isbusy === false) {
      this.service.EmailExist(email).subscribe(x => {
        this.messageValidate.email.matchEmail = 'Email is already used';
      }, ex => console.log(ex));
      return true;
    } else {
      this.messageValidate.email.matchEmail = null;
    }
    return false;
  }
}


