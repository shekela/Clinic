import { Component, OnInit } from '@angular/core';
import { UserService } from '../_Services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit{
 constructor(private auth: UserService, private route: Router){}
 ngOnInit(): void {
  this.getDoctors();
 }

 doctors: any;
 filteredDoctors: any;

 getDoctors(){
  this.auth.getDoctors().subscribe(x => {
    this.doctors = x;
    console.log(x)
  })
}
moveOnProfile(id){
  this.auth.increaseView(id).subscribe(x => console.log(x))
  this.route.navigate([`./Profile/${id}`]);
}
filterObjects(searchWithName: string, searchWithCategory: string) {
  if (!searchWithName && !searchWithCategory) {
    this.getDoctors()
  } else {
    this.filteredDoctors = this.doctors.filter(obj => {
      const nameMatch = !searchWithName || obj.firstname.toLowerCase().includes(searchWithName.toLowerCase());
      const categoryMatch = !searchWithCategory || obj.categories.toLowerCase().includes(searchWithCategory.toLowerCase());
      return nameMatch && categoryMatch;
    });
  }
  this.doctors = this.filteredDoctors;
}
pinnedObjects: number[] = [];
pinObject(obj: any) { // Replace 'any' with the appropriate type for your objects
  const objId = obj.id;

  // Check if the object is already pinned
  const index = this.pinnedObjects.indexOf(objId);
  if (index > -1) {
    // Object is already pinned, so unpin it
    this.pinnedObjects.splice(index, 1);
  } else {
    // Object is not pinned, so pin it
    this.pinnedObjects.unshift(objId); // Add the object ID at the beginning of the array
  }

  // Sort the objects based on the pinned objects array
  this.doctors.sort((a, b) => {
    const aPinned = this.pinnedObjects.includes(a.id);
    const bPinned = this.pinnedObjects.includes(b.id);
    if (aPinned && !bPinned) {
      return -1; // 'a' is pinned, 'b' is not pinned
    } else if (!aPinned && bPinned) {
      return 1; // 'b' is pinned, 'a' is not pinned
    } else {
      return 0; // Both objects are either pinned or not pinned
    }
  });

  console.log(this.pinnedObjects);
}
}
