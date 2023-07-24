import { AfterViewInit, Component, OnInit } from '@angular/core';
import { UserService } from '../_Services/user.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  constructor(private auth: UserService, private route: ActivatedRoute, private router: Router){}

  ngOnInit(): void {
    this.getDoctors();
  }
  doctors: any;


  getDoctors(): void {
    this.route.paramMap.subscribe((params) => {
      const name = params.get('id')!;
      this.auth.getDoctorsByCategory(name).subscribe((x) => {
        this.doctors = x;
      });
    });
  }
 
  
 

 }

