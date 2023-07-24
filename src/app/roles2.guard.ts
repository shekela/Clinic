import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './_Services/user.service';

@Injectable({
  providedIn: 'root'
})
export class Roles2Guard implements CanActivate {
  constructor(private parseS: UserService){
  }
  canActivate(){
    const token = localStorage.getItem("token");
    if (token) {
      const userRole = this.parseS.parseJwt(token).role;
      if (userRole === "Doctor") {
        return false;
      }
    }
    return true;
  }
}
