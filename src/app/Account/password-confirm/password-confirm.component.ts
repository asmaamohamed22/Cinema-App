import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResetPasswordModel } from 'src/app/models/resetPasswords';
import { CryptService } from 'src/app/services/crypt.service';
import { CustomvalidationService } from 'src/app/services/customvalidation.service';
import { RegisterService } from 'src/app/services/register.service';

@Component({
  selector: 'app-password-confirm',
  templateUrl: './password-confirm.component.html',
  styleUrls: ['./password-confirm.component.css']
})
export class PasswordConfirmComponent implements OnInit {
  userForm: FormGroup;
  message: string;
  passModel: ResetPasswordModel;
  constructor(
    private fb: FormBuilder,
    private service: RegisterService,
    private customValidator: CustomvalidationService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private encService: CryptService
    ) { }
    messageValidate = {
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
    this.userForm = this.fb.group({
      password: ['', Validators.compose([Validators.required, Validators.minLength(8), this.customValidator.patternValidator()])],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
    },
      {
        validator: this.customValidator.MatchPassword('password', 'confirmPassword'),
      }
    );
    this.passModel = {
      Id: '',
      Token: '',
      Password: ''
    }
    this.activeRoute.queryParams.subscribe(param => {
      var exist = false;
      this.passModel.Id = param['ID'];
      this.passModel.Token = param['Token'];
      if (this.passModel.Id && this.passModel.Token) {
        var keys = Object.keys(localStorage);
        keys.forEach(element => {
          if (element !== null && element.includes('token')) {
            var item = localStorage.getItem(element);
            if (item !== null) {
              var token = this.encService.Decrypt(item);
              if (token === this.passModel.Token) {
                exist = true;
                return;
              }
            }
          }
        });
        if (!exist) {
          this.router.navigate(['home']).then(x => { window.location.reload(); })
        }
      } else {
        this.router.navigate(['home']).then(x => { window.location.reload(); })
      }
    }, ex => console.log(ex));

    this.userForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirm: ['', [Validators.required, Validators.minLength(6)]],
    });

  }

  ResetPassword() {
    if (this.userForm.value.password !== null) {
      this.passModel.Password = this.userForm.value.password;
      this.service.ApiResetPassword(this.passModel).subscribe(x => {
        console.log('success');
        this.router.navigate(['login']);
      }, ex => console.log(ex))
    }
  }
}
