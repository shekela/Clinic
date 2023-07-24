import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    Authorization: 'Bearer ' + localStorage.getItem('token'),
  }),
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = "http://localhost:5155/api/Users/";

  constructor(private http: HttpClient) { }

  getDoctors(){
    return this.http.get(this.baseUrl + "GetDoctors", httpOptions)
  }
  getSingleDoctor(id: any){
    return this.http.get(`${this.baseUrl}GetSingleDoctor/${id}`, httpOptions)
  }
  updatePhoto(id,file){
    return this.http.put(`http://localhost:5155/api/Account/ChangePhoto/${id}`,file, httpOptions);
  }
  parseJwt(token: any){
    var base64url = token.split('.')[1];
    var base64 = decodeURIComponent(atob(base64url).split('').map((c)=>{
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return(JSON.parse(base64))
  }
  getDoctorTimesForClient(clientid, doctorid){
    return this.http.get(`${this.baseUrl}GetReservedTimes/${clientid}/${doctorid}`, httpOptions)
  }
  getDoctorTimes(doctorid){
    return this.http.get(`${this.baseUrl}GetDoctorTimes/${doctorid}`, httpOptions)
  }
  getProfileDates(role, id){
    return this.http.get(`${this.baseUrl}GetProfileDates/${role}/${id}`, httpOptions)
  }
  getDoctorsByCategory(category: any){
    return this.http.get(`http://localhost:5155/api/Users/GetDoctorsByCategory/${category}`, httpOptions)
  }
  getAllUsers(){
    return this.http.get(`http://localhost:5155/api/Users/GetAllUsers`, httpOptions);
  }
  editUser(obj: any){
    return this.http.put(`http://localhost:5155/api/Users/Edituser`, obj, httpOptions);
  }
  deleteUser(role, id){
    return this.http.get(`http://localhost:5155/api/Users/Delete/user/${role}/${id}`, httpOptions);
  }
  deleteUserFromProfile(role, id){
    return this.http.get(`http://localhost:5155/api/Users/Delete/user/${role}/${id}`, httpOptions);
  }
  increaseView(id){
    return this.http.get(`http://localhost:5155/api/Users/IncreaseView/${id}`, httpOptions);
  }
  getUserForAdmin(role, id){
    return this.http.get(`http://localhost:5155/api/Admin/GetUserProfile/${role}/${id}`, httpOptions);
  }
  getClients(){
    return this.http.get('http://localhost:5155/api/Users/GetClients', httpOptions);
  }
  check2fa(email){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const options = { headers: headers, withCredentials: true };
    return this.http.get(`http://localhost:5155/api/Account/Check2FA/${email}`, options);
  }
  change2FA(obj){
      return this.http.post(`http://localhost:5155/api/Account/Change2FA`, obj);
  }
  getClientSec(role, id){
      return this.http.get(`http://localhost:5155/api/Account/GetSecurity/${role}/${id}`)
  }
}
