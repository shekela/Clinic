import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistrationComponent } from './registration/registration.component';
import { MainComponent } from './main/main.component';
import { ClientComponent } from './client/client.component';
import { DoctorComponent } from './doctor/doctor.component';
import { AdminComponent } from './admin/admin.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ContactComponent } from './contact/contact.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DoctorRegistrationComponent } from './doctor-registration/doctor-registration.component';;
import { FullCalendarModule } from '@fullcalendar/angular';
import { CategoriesComponent } from './categories/categories.component';
import { CategoryComponent } from './category/category.component';
import { CategoriesNavbarComponent } from './categories-navbar/categories-navbar.component';


@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    MainComponent,
    ClientComponent,
    DoctorComponent,
    AdminComponent,
    NavbarComponent,
    ContactComponent,
    DoctorRegistrationComponent,
    CategoriesComponent,
    CategoryComponent,
    CategoriesNavbarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FullCalendarModule,
  ],
  providers: [NavbarComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
