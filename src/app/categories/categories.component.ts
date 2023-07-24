import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../_Services/user.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})

export class CategoriesComponent implements OnInit{
  constructor(private service: UserService){}
  data: any;
  id: any;
  
  deletingRole: any;
  deletingId: any;

  @ViewChild('myForm') myForm: ElementRef;
  @ViewChild('dialog') dialog: ElementRef;
  @ViewChild('deleteUser') deleteUser: ElementRef
  photoValue: File;
  photoPreview: string;

  setPhotoValue(photoUrl: string) {
    this.photoValue = null; // Clear the file selection
    this.photoPreview = photoUrl; // Set the photo preview
  }

  previewPhoto(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.photoValue = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      this.photoValue = null;
      this.photoPreview = null;
    }
  }

  getAllusers(){
    this.service.getAllUsers().subscribe(x => {
      this.data = x;
      console.log(x)
    });
  }
  getId(id: any){
    this.id = id;
  }
  closeDialog(){
    if (this.dialog) {
      this.dialog.nativeElement.close();
    }
  }
  closeDialog2(){
      this.deleteUser.nativeElement.close();
  }
  editUser(role){
    const formElement = this.myForm.nativeElement as HTMLFormElement;
    const data = new FormData();
    
    const firstname = (formElement.elements.namedItem('Firstname') as HTMLInputElement).value;
    const lastname = (formElement.elements.namedItem('Lastname') as HTMLInputElement).value;
    const categories = (formElement.elements.namedItem('Categories') as HTMLInputElement).value;
    const photo = (formElement.elements.namedItem('Photo') as HTMLInputElement)?.files[0];
    
    data.append("Id", this.id);
    data.append("Firstname", firstname);
    data.append("Lastname", lastname);
    data.append("Categories", categories);
    data.append("Role", role);
    data.append("Photo", photo);

    this.service.editUser(data).subscribe(x => {
      this.closeDialog();
      this.getAllusers();
    })
  }

  deleteUserAction(role: string, id: string) {
    this.deletingId = id;
    this.deletingRole = role;
  }

  confirmDeleting(){
    this.service.deleteUser(this.deletingRole, this.deletingId).subscribe(x => {
      console.log(x);
      this.getAllusers();
      this.closeDialog2();
     })
     this.closeDialog2();
     this.getAllusers();
  }

  ngOnInit(): void {
    this.getAllusers();
  }
}
