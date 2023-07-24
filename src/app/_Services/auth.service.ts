import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid'; // import uuid library

@Injectable({
  providedIn: 'root'
})


export class AuthService {
  baseUrl = "http://localhost:5155/api/Account";
  private boundary = uuidv4();

  constructor(private http: HttpClient) { }
  
  parseJwt(token: any){
    var base64url = token.split('.')[1];
    var base64 = decodeURIComponent(atob(base64url).split('').map((c)=>{
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return(JSON.parse(base64))
  }
  SendMail(email: string){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const options = { headers: headers, withCredentials: true };
    const url = `${this.baseUrl}/send-email-otp/${email}`;
    return this.http.get(url, options);
  }
  SendReset(email: string){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const options = { headers: headers, withCredentials: true };
    const url = `${this.baseUrl}/send-reset-otp/${email}`;
    return this.http.get(url, options);
  }
  SignUp(UserObj: any){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const options = { headers: headers, withCredentials: true };
    return this.http.post('http://localhost:5155/api/Account/register', UserObj, options)
  }
  SignUpDoctor(UserObj: any){
    return this.http.post('http://localhost:5155/api/Account/register-doctor', UserObj)
  }

  Login(UserObj: any){
    return this.http.post('http://localhost:5155/api/Account/login', UserObj, { withCredentials: true });
  }
  
  ResetPassword(UserObj: any){
    return this.http.post('http://localhost:5155/api/Account/ResetPassword', UserObj, { withCredentials: true })
  }
}