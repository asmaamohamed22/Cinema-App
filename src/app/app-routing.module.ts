import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgetPasswordComponent } from './Account/forget-password/forget-password.component';
import { LoginComponent } from './Account/login/login.component';
import { PasswordConfirmComponent } from './Account/password-confirm/password-confirm.component';
import { RegisterConfirmComponent } from './Account/register-confirm/register-confirm.component';
import { RegisterComponent } from './Account/register/register.component';
import { DashboardComponent } from './Admin/dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {path: '', component: HomeComponent, pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'registerconfirm', component: RegisterConfirmComponent},
  {path: 'forgetpassword', component: ForgetPasswordComponent},
  {path: 'passwordconfirm', component: PasswordConfirmComponent},
  {path: 'dashboard', component: DashboardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
