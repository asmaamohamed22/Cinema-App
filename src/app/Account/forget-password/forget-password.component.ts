import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CryptService } from 'src/app/services/crypt.service';
import { RegisterService } from 'src/app/services/register.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

  message: string = '';
  forgetForm: FormGroup;

  constructor(
    private service: RegisterService,
    private fb: FormBuilder,
    private encService: CryptService
  ) { }

  messageValidate = {
    email: {
      required: 'Email Is Required',
      patt: 'Email Is Invalid'
    }
  };

  ngOnInit() {
    this.forgetForm = this.fb.group({
      email: ['', Validators.required],
    });
  }
  
  RequestPassword() {
    var email = this.forgetForm.value.email;
    if (email !== null || email !== '') {
      this.service.ForgetPassword(email).subscribe(x => {
        var i = 0;
        var exist = false;
        var token = Object.values(x).toString();
        while (localStorage.getItem('token' + i) !== null) {
          i++;
          if (localStorage.getItem('token' + i) === null) {
            localStorage.setItem('token' + i, this.encService.Encrypt(token));
            exist = true;
            break;
          }
        }
        if (!exist) {
          localStorage.setItem('token' + i, this.encService.Encrypt(token));
        }
        this.message = 'If the email entered is correct, an activation message has been sent to it';
      }, ex => console.log(ex));
    }
  }

}

