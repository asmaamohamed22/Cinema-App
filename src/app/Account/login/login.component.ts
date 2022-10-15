import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginModel } from 'src/app/models/login.model';
import { AuthService } from 'src/app/services/auth.service';
import { CustomvalidationService } from 'src/app/services/customvalidation.service';
import { RegisterService } from 'src/app/services/register.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginModel: LoginModel;
  loginForm: FormGroup;
  submitted = false;
  message: string = '';

  constructor(
    private fb: FormBuilder,
    private service: RegisterService,
    private router: Router,
    private auth: AuthService) { }

  messageValidate = {
    email: {
      required: 'Email is required',
      notValid: 'Email is Invalid',
      matchEmail: ''
    },
    password: {
      required: 'Password is Required',
    }
  };

  get loginFormControl() {
    return this.loginForm.controls;
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: false
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.service.Login(this.loginForm.value).subscribe(
        (success) => {
          const remember = !!this.loginForm.value.rememberMe;
          const email = this.loginForm.value.email;
          this.auth.installStorage(remember, email);
          this.router.navigate(['home']).then(x => { window.location.reload() });;
        },
        (err) => {
          console.log(err)
          this.message = err.error;
        }
      )
    };
  }

}
