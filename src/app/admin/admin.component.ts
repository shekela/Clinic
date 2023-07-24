import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../_Services/user.service';
import { CalendarOptions } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

const httpOptions = {
  headers: new HttpHeaders({
    Authorization: 'Bearer ' + localStorage.getItem('token'),
  }),
};

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit{
    constructor(private service: UserService, private userService: UserService, private http: HttpClient, private route: ActivatedRoute){}
    Emaily = localStorage.getItem("email");
    tokenObj: any;
    doctor = false;
    data: any;
    token: any;
    calendarOptions: CalendarOptions;
    change = false;
    submit = false;

    problem: any;
    reservationInput = '';
    reservationInputToShow = '';


    savedDates = [];
    user: any;
    ClientId: any;
    Role: any;

    doctors: any;
    clients: any;

    chosenDoctor = "";
    chosenClient = "";

    id2: any;

    @ViewChild('cancelation') cancelationDialog!: ElementRef<HTMLDialogElement>;
    @ViewChild('edit') editDialog!: ElementRef<HTMLDialogElement>;
    @ViewChild('add') addDialog!: ElementRef<HTMLDialogElement>;
    @ViewChild('addGuide') addGuide!: ElementRef<HTMLDialogElement>;

    getDoctors(){
      this.service.getDoctors().subscribe(x => {
        this.doctors = x;
        console.log(x)
      })
    }
    getClients(){
      this.service.getClients().subscribe(x => {
        this.clients = x;
        console.log(x)
      })
    }
    chooseClient(user: any){
      this.id2 = user.id;
      let fname = user.firstname;
      let lname = user.lastname
      this.chosenClient = fname + " " + lname;
    }
    chooseDoctor(user: any){
      this.id2 = user.id;
      let fname = user.firstname;
      let lname = user.lastname;
      this.chosenDoctor = fname + " " + lname;
    }

    handleDateClick(arg) {    
      const clickedDate = arg.date ? arg.date.toISOString() : null;
      const today = new Date().toISOString();
      if (clickedDate < today) {
        alert("Cannot reserve past dates.");
        return;
      }

      if (arg.event) {
        const event = arg.event;
        const clickedDate = event.start.toISOString();
        this.showCancelationDialog(); // Show the dialog for reservation confirmation
        this.reservationInput = clickedDate;
        this.reservationInputToShow = arg;
      }
      else {
        if (!this.savedDates.includes(clickedDate)) {
          this.showAdd(); // Show the dialog for reservation confirmation
          this.reservationInput = clickedDate; // Set the clicked date in the input field (if needed)
        } 
      }
        const calendarApi = arg.view.calendar;
        calendarApi.removeAllEvents();
        calendarApi.addEventSource(this.savedDates.map(date => {
          return {
            title: 'დაჯავშნილია',
            start: date,
            backgroundColor: "#7FE186",
            textColor: '#000000'
          };
        }));
    }
    showCancelationDialog(){
      if(this.cancelationDialog){
        this.cancelationDialog.nativeElement.showModal();
      }
    }
    showEditDialog(){
      if(this.editDialog){
        this.editDialog.nativeElement.showModal();
      }
    }
    showAdd(){
      if(this.addDialog){
        this.addDialog.nativeElement.showModal();
      }
    }
    showGuide(){
      if(this.addGuide){
        this.addGuide.nativeElement.showModal();
      }
    }

    confirmCancelation(){
      const role = this.route.snapshot.paramMap.get('role');
      if(role == "Doctor"){
        this.removeReservationOnDPage(this.reservationInput);
      }
      if(role == "Client"){
        this.removeReservationOnCPage(this.reservationInput);
      }
      this.closeCancelationDialog();
    }

    confirmEdition(){
      const clickedDate = this.reservationInput;
      this.closeEditionDialog();
    }
    confirmAdd(problem){
      const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
      const role = this.route.snapshot.paramMap.get('role');
      if(role == 'Client'){
         this.addReservationOnCPage(problem, id, this.id2)
      }
      if(role == 'Doctor'){
        this.addReservationOnDPage(problem, this.id2, id)
      }
      this.closeAdd()
      this.getTimes();
    }



    
    closeCancelationDialog(): void {
      if (this.cancelationDialog) {
        this.cancelationDialog.nativeElement.close();
      }
      this.getTimes()
    }
    closeEditionDialog(): void {
      if (this.editDialog) {
        this.editDialog.nativeElement.close();
      }
      this.getTimes()
    }
    closeAdd(){
      if (this.addDialog) {
        this.addDialog.nativeElement.close();
      }
      this.getTimes()
    }
    closeAddGuide(){
      if (this.addGuide) {
        this.addGuide.nativeElement.close();
      }
      this.getTimes()
    }

  
    removeReservationOnCPage(date) {
      const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
      let data = new FormData();
      data.append("Date", date.toString())
      data.append("ClientId", id.toString())
      this.http.post("http://localhost:5155/api/Users/deletedatefromprofile", data, httpOptions).subscribe(x => {
        this.getTimes();
      })
      this.getTimes();
    }
    removeReservationOnDPage(date) {
      const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
      let data = new FormData();
      data.append("Date", date.toString())
      data.append("DoctorId", id.toString())
      this.http.post("http://localhost:5155/api/Users/deletedatefromprofile", data, httpOptions).subscribe(x => {
        this.getTimes();
      })
      this.getTimes();
    }
    addReservationOnCPage(problem, cid, did) {
      let data = new FormData();
      data.append("Date", this.reservationInput)
      data.append("ClientId", cid)
      data.append("DoctorId", did)
      data.append("Problem", problem)
      this.http.post("http://localhost:5155/api/Users/AddDate", data, httpOptions).subscribe(x => {
        this.getTimes();
      })
      this.getTimes();
  }
   addReservationOnDPage(problem, cid, did) {
    let data = new FormData();
    data.append("Date", this.reservationInput)
    data.append("ClientId", cid)
    data.append("DoctorId", did)
    data.append("Problem", problem)
    this.http.post("http://localhost:5155/api/Users/AddDate", data, httpOptions).subscribe(x => {
      this.getTimes();
    })
    this.getTimes();
 }
  
    getTimes(){
      interface ApiResponse {
        times: any[];
      }
      this.userService.getProfileDates(this.Role, this.ClientId).subscribe((x: ApiResponse) => {
        this.savedDates = x.times;
  
        const greenEvents = this.savedDates.map(date => ({
            title: 'დაჯავშნილია',
            start: date,
            backgroundColor: "#7FE186",
            textColor: '#000000'
        }));
  
        this.calendarOptions.events = [...greenEvents];
        console.log(x)
      });
  
  }
  getUser(){
    this.service.getUserForAdmin(this.Role, this.ClientId).subscribe(x => {
      this.user = x;
      console.log(x);
    })
  }
    ngOnInit(): void {
      const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
      const role = this.route.snapshot.paramMap.get('role');

      this.ClientId = id;
      this.Role = role;

      this.getUser()
      this.getTimes()

      if(this.Role == 'Client'){
        this.getDoctors()
      }

      else if(this.Role == 'Doctor'){
        this.getClients()
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
