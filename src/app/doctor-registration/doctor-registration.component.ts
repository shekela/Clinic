import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../_Services/auth.service';


@Component({
  selector: 'app-doctor-registration',
  templateUrl: './doctor-registration.component.html',
  styleUrls: ['./doctor-registration.component.css']
})
export class DoctorRegistrationComponent {
  OTPTimeout = false;
  OTPFalse = false;
  

  constructor(private auth: AuthService) {
    
  }

  RegisterForm = new FormGroup({
    Firstname: new FormControl("", [Validators.required, Validators.min(5), Validators.max(20)]),
    Lastname: new FormControl("", [Validators.required, Validators.min(5), Validators.max(20)]),
    Email:  new FormControl("", [Validators.required, Validators.email, Validators.min(10), Validators.max(20)]),
    Password: new FormControl("", [Validators.required, Validators.min(8), Validators.max(20)]),
    Idnumber: new FormControl("", [Validators.required, Validators.min(8), Validators.max(10)]),
    Categories: new FormControl(""),
    Photo : new FormControl(""),
    Cvfile: new FormControl("")
  })
  
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
   get Categories(): FormControl { 
    return this.RegisterForm.get('Categories') as FormControl;
   }
   get Photo(): FormControl {
    return this.RegisterForm.get("Photo") as FormControl;
   }
   get Cvfile(): FormControl {
    return this.RegisterForm.get("Cvfile") as FormControl;
   }

  @ViewChild('myForm') myForm: ElementRef;
   
  signUp(){
      const formData = new FormData();
      const formElement = this.myForm.nativeElement as HTMLFormElement;

      // Retrieve form field values
      const firstName = (formElement.elements.namedItem('Firstname') as HTMLInputElement)?.value;
      const email = (formElement.elements.namedItem('Email') as HTMLInputElement)?.value;
      const idNumber = (formElement.elements.namedItem('Idnumber') as HTMLInputElement)?.value;
      const lastName = (formElement.elements.namedItem('Lastname') as HTMLInputElement)?.value;
      const password = (formElement.elements.namedItem('Password') as HTMLInputElement)?.value;
      const categories = (formElement.elements.namedItem('Categories') as HTMLInputElement)?.value;

      // Retrieve file inputs
      const photo = (formElement.elements.namedItem('Photo') as HTMLInputElement)?.files[0];
      const cvFile = (formElement.elements.namedItem('Cvfile') as HTMLInputElement)?.files[0];

      // Append form field values to FormData
      formData.append('Firstname', firstName);
      formData.append('Email', email);
      formData.append('Idnumber', idNumber);
      formData.append('Lastname', lastName);
      formData.append('Password', password);
      formData.append('Categories', categories);

      // Append file inputs to FormData
      formData.append('Photo', photo);
      formData.append('Cvfile', cvFile);

      return this.auth.SignUpDoctor(formData).subscribe(x => console.log(x));
  }

  
  
  
}
