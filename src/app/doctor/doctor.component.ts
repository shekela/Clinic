import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { UserService } from '../_Services/user.service';
import { AuthService } from '../_Services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    Authorization: 'Bearer ' + localStorage.getItem('token'),
  }),
};

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css']
})

export class DoctorComponent implements OnInit{
  constructor(private route: ActivatedRoute, private service: UserService, private parseS: AuthService, private http: HttpClient, ){}
  
  data: any;
  color: any;
  tokenObj: any;
  DoctorId: any;
  ClientId: any;
  Problem: any;

  getClient() {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.DoctorId = id;
    this.service.getSingleDoctor(id).subscribe(x => {
      this.data = x;
    })
  }
  
  name: any;
  category: any;
  reservations: any;
  calendarOptions: CalendarOptions;
  
  savedDates = []
  savedDatesTwo = []
  savedDatesThree = []
  


  @ViewChild('reserve') reserveDialog!: ElementRef<HTMLDialogElement>;
  @ViewChild('cancelation') cancelationDialog!: ElementRef<HTMLDialogElement>;

  reservationInput = '';

  handleDateClick(arg) {
    if(localStorage.getItem("token") == null){
      return alert("Please login or register")
    }
    const clickedDate = arg.date ? arg.date.toISOString() : null;
    
    const today = new Date().toISOString();
      if (clickedDate < today) {
        alert("Cannot reserve past dates.");
        return;
      }
      
    if (arg.event) {
      const event = arg.event;
      const clickedDate = event.start.toISOString();
      if(this.savedDates.includes(clickedDate)){
        this.showCancelationDialog(); // Show the dialog for reservation confirmation
        this.reservationInput = clickedDate;
      }
      else{
        this.getTimes()
      }
    } 
    else {
      if (!this.savedDates.includes(clickedDate)) {
        this.showDialog(); // Show the dialog for reservation confirmation
        this.reservationInput = clickedDate; // Set the clicked date in the input field (if needed)
      } 
      else if (!this.savedDatesThree.includes(clickedDate)) {
        this.showDialog(); // Show the dialog for reservation confirmation
        this.reservationInput = clickedDate; // Set the clicked date in the input field (if needed)
      } 
      else {
        this.showCancelationDialog(); // Show the dialog for reservation confirmation
        this.reservationInput = clickedDate;
      }
    }
    
    const calendarApi = arg.view.calendar;
    calendarApi.removeAllEvents();
  }
  
  showDialog(): void {
    if (this.reserveDialog) {
      this.reserveDialog.nativeElement.showModal();
    }
  }
  showCancelationDialog(){
    if(this.cancelationDialog){
      this.cancelationDialog.nativeElement.showModal();
    }
  }

  confirmCancelation(){
    const clickedDate = this.reservationInput;
    this.removeReservation(clickedDate);
    this.closeCancelationDialog();
  }
  cancelReservation(): void {
    this.closeDialog(); // Close the dialog without taking any action
  }
  
  confirmReservation(problem: any): void {
    const clickedDate = this.reservationInput; // Get the clicked date from the input field or any other source
    this.addReservation(clickedDate, problem); // Execute the reservation addition
    this.closeDialog(); // Close the dialog
    console.log(problem)
  }

  deleteReservation(): void {
    const clickedDate = this.reservationInput; // Get the clicked date from the input field or any other source
    this.removeReservation(clickedDate); // Execute the reservation addition
    this.closeDialog(); // Close the dialog
  }
  
  closeDialog(): void {
    if (this.reserveDialog) {
      this.reserveDialog.nativeElement.close();
    }
    this.getTimes();
  }
  closeCancelationDialog(): void {
    if (this.cancelationDialog) {
      this.cancelationDialog.nativeElement.close();
    }
    this.getTimes()
  }
  

addReservation(date, problem) {
    let data = new FormData();
    data.append("Date", date.toString())
    data.append("ClientId", this.ClientId)
    data.append("DoctorId", this.DoctorId)
    data.append("Problem", problem)
    this.http.post("http://localhost:5155/api/Users/AddDate", data, httpOptions).subscribe(x => {
      this.getTimes();
    })
    this.getTimes();
}


removeReservation(date) {
  const index = this.savedDates.findIndex(savedDate => savedDate === date);
  if (index > -1) {
    let data = new FormData();
    data.append("Date", date.toString())
    data.append("ClientId", this.ClientId)
    data.append("DoctorId", this.DoctorId)
    this.http.post("http://localhost:5155/api/Users/DeleteDate", data, httpOptions).subscribe(x => {
      this.getTimes();
    })
  }
  else{
    this.getTimes();
  }
}


getTimes(){
    interface ApiResponse {
      clientDates: any[];
      reservedDates: any[];
      reservedWithOther: any[];
    }

    this.service.getDoctorTimesForClient(this.ClientId, this.DoctorId).subscribe((x: ApiResponse) => {
      console.log("xxxxx " + this.ClientId + " " + this.DoctorId)
      this.savedDates = x.clientDates;
      this.savedDatesTwo = x.reservedDates;
      this.savedDatesThree = x.reservedWithOther
      ;

      const redEvents = this.savedDatesTwo.map(date => ({
        title: 'დაკავებულია',
        start: date,
        backgroundColor: 'red'
      }));

      const greenEvents = this.savedDates.map(date => ({
        title: 'დაჯავშნილი გაქვს',
        start: date,
        backgroundColor: '#7FE186',
        color: 'black'
      }));

      const yellowEvents = this.savedDatesThree.map(date => ({
        title: 'ეს დრო დაკავებული გაქვს',
        start: date,
        backgroundColor: '#FFFFF5',
        textColor: '#000000'
      }));


      this.calendarOptions.events = [...redEvents, ...greenEvents, ...yellowEvents];
      console.log(x)
    });
}


getDocTimes(){
  interface ApiResponse {
    clientDates: any[];
  }

  this.service.getDoctorTimes(this.DoctorId).subscribe((x: ApiResponse) => {
    this.savedDates = x.clientDates;  

    const redEvents = this.savedDates.map(date => ({
      title: 'დაკავებულია',
      start: date,
      backgroundColor: 'red'
    }));

    this.calendarOptions.events = [...redEvents];
  });
}

ngOnInit() {
  if(localStorage.getItem("token") != null){
    this.tokenObj = this.parseS.parseJwt(localStorage.getItem("token"));
    this.ClientId = this.tokenObj.Id;
    this.getClient();
    this.getTimes();
  }
  else{
    console.log("xxxxxxxxxxxxxxyyyyyyyyyy")
    this.getClient();
    this.getDocTimes()
  }
  
  
  this.calendarOptions = {
    weekends: false,
    plugins: [timeGridPlugin, interactionPlugin, listPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'timeGridWeek,timeGridDay'
    },
    views: {
      timeGridWeek: {},
      timeGridDay: {}
    },
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleDateClick.bind(this),
    initialView: 'timeGridWeek',
    slotMinTime: '09:00:00',
    slotMaxTime: '17:00:00',
    slotDuration: '01:00:00',
    businessHours: {
      daysOfWeek: [1, 2, 3, 4, 5], // Monday - Friday
      startTime: '09:00',
      endTime: '17:00'
    },
     // Initialize an empty events array
  };
  
}
}

