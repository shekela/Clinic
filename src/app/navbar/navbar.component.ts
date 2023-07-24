import { Component, ElementRef, EventEmitter, HostListener, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../_Services/auth.service';
import { an } from '@fullcalendar/core/internal-common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../_Services/user.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isLogged = false;
  data: any;
  active = false;
  SecurityOn: boolean;

  @ViewChild('Otp') Otp!: ElementRef<HTMLDialogElement>;
  @ViewChild('loginModal') loginModal22!: ElementRef<HTMLDialogElement>;

  constructor(private auth: AuthService, private route: Router, private http: HttpClient, private parseS: UserService) {
    if(localStorage.getItem("email")){
      this.isLogged = true;
      this.http.get("http://localhost:5155/api/Users/getloginuser/" + localStorage.getItem("email")).subscribe(x => {
       this.data = x;
    })
    }
  }

  tokenObj: any;

  loginForm = new FormGroup({
    Email: new FormControl("", [Validators.required, Validators.min(8), Validators.email]),
    Password: new FormControl("", [Validators.required, Validators.min(8)]),
    OtpCode: new FormControl("", [Validators.required])
  })
  
  get Email(): FormControl { 
    return this.loginForm.get('Email') as FormControl;
   }
 
  get Password(): FormControl {
    return this.loginForm.get('Password') as FormControl;
  }
  get OtpCode(): FormControl {
    return this.loginForm.get('OtpCode') as FormControl;
  }


  resetPassword = new FormGroup({
    EmailR: new FormControl(""),
    OtpR: new FormControl(""),
    PasswordR: new FormControl("")
  })
  get EmailR(): FormControl { 
    return this.resetPassword.get('EmailR') as FormControl;
   }
  get PasswordR(): FormControl {
    return this.resetPassword.get('PasswordR') as FormControl;
  }
  get OtpR(): FormControl {
    return this.resetPassword.get('OtpR') as FormControl;
  }

  loginModal = false;
  resetPass = false;
  showModal(){
    this.loginModal = true;
  }
  hideModal(){
    this.loginModal = false;
    this.resetPass = false;
  }
  switchReset(){
    this.loginModal = false;
    this.resetPass = true;
  }
  switchLogin(){
    this.loginModal = true;
    this.resetPass = false;
  }
  switchOtp(){
    this.loginModal = false;
    this.SecurityOn = true;
  }
  Otpcode: any;
  
  CheckLogin(email) {
    interface ApiResponse {
      response: string;
    }
    console.log("Email:", email); // Check if the email has a valid value
    this.parseS.check2fa(email).subscribe((x: ApiResponse) => {
      if (x.response == "ON") {
        this.switchOtp();
      } 
      else if(x.response == "OFF"){
        this.Login();
      }
    });
  }
  Login(){
    this.auth.Login(this.loginForm.value).subscribe(x => {
      complete:{
        localStorage.setItem("token", x["token"]);
        localStorage.setItem("email", x["email"]);
        this.route.navigate(["/Myprofile"]);
      }
    })
  }

  SendReset(email: any){
    this.auth.SendReset(email).subscribe(x => {
      console.log(x);
    })
  }

  ResetPassword(){
    this.auth.ResetPassword(this.resetPassword.value).subscribe(x => {
      console.log(x);
    })
  }
  activeLogout(){
    if(this.active == true){
      this.active = false
    }
    else{
      this.active = true;
    }
  }
  logout(){
    localStorage.removeItem("token")
    localStorage.removeItem("email")
    this.route.navigate(["./"]);
  }


  @Output() filter = new EventEmitter<any>(); // Replace 'any' with the appropriate type for your objects
  searchWithName: string;
  searchWithCategory: string;

  onSearch() {
    this.filter.emit({ searchWithName: this.searchWithName, searchWithCategory: this.searchWithCategory });
  }
}
