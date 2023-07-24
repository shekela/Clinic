import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { RegistrationComponent } from './registration/registration.component';
import { MainComponent } from './main/main.component';
import { ContactComponent } from './contact/contact.component';
import { DoctorRegistrationComponent } from './doctor-registration/doctor-registration.component';
import { DoctorComponent } from './doctor/doctor.component';
import { ClientComponent } from './client/client.component';
import { CategoriesComponent } from './categories/categories.component';
import { CategoryComponent } from './category/category.component';
import { AdminComponent } from './admin/admin.component';
import { RolesGuard } from './roles.guard';
import { Roles2Guard } from './roles2.guard';
import { Roles3Guard } from './roles3.guard';

const routes: Routes = [
  {path:"", component: MainComponent},
  {path:"Register", component: RegistrationComponent},
  {path:"Profile/:id", component: DoctorComponent, canActivate: [Roles2Guard]},
  {path:"Categories/:id", component: CategoryComponent, canActivate: [RolesGuard]},
  {path: "Myprofile", component: ClientComponent},
  //AdminPages
  {path:"Doctor/Registration", component: DoctorRegistrationComponent, canActivate:[Roles3Guard]},
  {path:"Categories/Userprofile/:role/:id", component: AdminComponent, canActivate:[Roles3Guard]},
  {path:"Categories", component: CategoriesComponent, canActivate:[Roles3Guard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 

}
