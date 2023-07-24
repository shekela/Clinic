import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './_Services/user.service';

@Injectable({
  providedIn: 'root'
})

export class RolesGuard implements CanActivate {
  tokenObj: any;
  constructor(private parseS: UserService){
    this.tokenObj = this.parseS.parseJwt(localStorage.getItem("token"));
  }
  canActivate(){
    if(this.tokenObj.role == "Client") {
      return true;
    }
    else if(this.tokenObj.role == "Doctor"){
      return true;
    }
    else if(this.tokenObj.role == "Admin"){
      return true;
    }
    return false;
  }
  
}