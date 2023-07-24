import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../_Services/user.service';

@Component({
  selector: 'app-categories-navbar',
  templateUrl: './categories-navbar.component.html',
  styleUrls: ['./categories-navbar.component.css']
})
export class CategoriesNavbarComponent {
  constructor(private auth: UserService, private route: ActivatedRoute, private router: Router){}
  doctors: any;
  getDoctors() {
    const name = this.route.snapshot.paramMap.get('id')!;
    this.auth.getDoctorsByCategory(name).subscribe(x => {
      this.doctors = x;
      this.getDoctors()
    })
  }
  switchCategory(category: any){
    this.router.navigate([`/Categories/${category}`]);
    this.getDoctors()
  }

}
