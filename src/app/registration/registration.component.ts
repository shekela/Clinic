import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../_Services/auth.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { ActivatedRoute, Router } from '@angular/router';

function passwordValidator(control: FormControl): { [key: string]: boolean } | null {
  const value: string = control.value;
  const hasCapitalLetter = /[A-Z]/.test(value);
  const hasNumber = /\d/.test(value);

  if (!hasCapitalLetter || !hasNumber) {
    return { invalidPassword: true };
  }

  return null;
}


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit{ 
  
    ngOnInit() {
      
    }
    
    OTPTimeout = false;
    OTPFalse = false;
    
    constructor(private auth: AuthService, private route: Router) {}

    RegisterForm = new FormGroup({
      Firstname: new FormControl("", [Validators.required, Validators.min(5), Validators.max(20)]),
      Lastname: new FormControl("", [Validators.required, Validators.min(5), Validators.max(20)]),
      Email:  new FormControl("", [Validators.required, Validators.email, Validators.min(10), Validators.max(20)]),
      Password: new FormControl("", [Validators.required, Validators.min(8), Validators.max(20), passwordValidator]),
      Idnumber: new FormControl("", [Validators.required, Validators.min(8), Validators.max(10)]),
      Otp: new FormControl("", [Validators.required, Validators.min(6), Validators.max(6)])
    });

     get Firstname(): FormControl { 
      return this.RegisterForm.get('Firstname') as FormControl;
     }
   
     get Lastname(): FormControl {
      return this.RegisterForm.get('Lastname') as FormControl;
     }
  
     get Email(): FormControl { 
      return this.RegisterForm.get('Email') as FormControl;
     }
   
     get Idnumber(): FormControl {
      return this.RegisterForm.get('Idnumber') as FormControl;
     }
  
     get Password(): FormControl { 
      return this.RegisterForm.get('Password') as FormControl;
     }
     get Otp(): FormControl { 
      return this.RegisterForm.get('Otp') as FormControl;
     }

     SendMail(email: string) {
      console.log('Sending OTP to email:', email);
      return this.auth.SendMail(email).subscribe(x => {
          console.log('Response from SendMail:', x);
      });
  }

    onSignup(){
      this.auth.SignUp(this.RegisterForm.value).subscribe(x => {
        console.log(x);
        localStorage.setItem("token", x["token"]);
        localStorage.setItem("email", x["email"]);
        this.route.navigate(["./Myprofile"]);
      })
    }

}
