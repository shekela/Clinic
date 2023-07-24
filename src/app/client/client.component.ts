import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventInput } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import { NavbarComponent } from '../navbar/navbar.component';
import { AuthService } from '../_Services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from '../_Services/user.service';

const httpOptions = {
  headers: new HttpHeaders({
    Authorization: 'Bearer ' + localStorage.getItem('token'),
  }),
};

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})


export class ClientComponent implements OnInit{
  constructor(private navdata: AuthService,private http: HttpClient, private userService: UserService) {}
  Emaily = localStorage.getItem("email");
  tokenObj: any;
  doctor = false;
  data: any;
  token: any;
  calendarOptions: CalendarOptions;
  change = false;
  submit = false;

  @ViewChild('myForm') myForm: ElementRef;
  @ViewChild('cancelation') cancelationDialog!: ElementRef<HTMLDialogElement>;

  savedDates = []

  ClientId: any;
  Role: any;
  

  reservationInput = '';

  handleDateClick(arg) {
    const clickedDate = arg.date ? arg.date.toISOString() : null;
    
    if (arg.event) {
      const event = arg.event;
      const clickedDate = event.start.toISOString();
      this.showCancelationDialog(); // Show the dialog for reservation confirmation
      this.reservationInput = clickedDate;
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

  confirmCancelation(){
    const clickedDate = this.reservationInput;
    this.removeReservation(clickedDate);
    this.closeCancelationDialog();
  }

  closeCancelationDialog(): void {
    if (this.cancelationDialog) {
      this.cancelationDialog.nativeElement.close();
    }
    this.getTimes()
  }

  removeReservation(date) {
    let data = new FormData();
    data.append("Date", date.toString())
    data.append("ClientId", this.ClientId)
    this.http.post("http://localhost:5155/api/Users/deletedatefromprofile", data, httpOptions).subscribe(x => {
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
  ngOnInit() {
    interface ApiResponse {
      response: any[];
    }

    this.http.get("http://localhost:5155/api/Users/getloginuser/" + this.Emaily).subscribe(x => {
       this.data = x;
       console.log(x)
    })

    this.tokenObj = this.userService.parseJwt(localStorage.getItem("token"));
    this.ClientId = this.tokenObj.Id;
    this.Role = this.tokenObj.role;
    
    this.getTimes()


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
    };
    this.getSecurity();
  }
  
  activeateChange(){
    if(this.change == true){
      this.change = false;
    }
    else{
      this.change = true;
    }
  }
  onFileSelected(event) {
    if(event.target.files.length > 0){
      this.submit = true;
    }
    if(event.target.files.length == 0){
      this.submit = false;
    }
  }
  onSubmit(){
    const formData = new FormData();
    const formElement = this.myForm.nativeElement as HTMLFormElement;

    const photo = (formElement.elements.namedItem('Photo') as HTMLInputElement)?.files[0];
    formData.append('PhotoFile', photo);

   this.userService.updatePhoto(this.tokenObj.Id, formData).subscribe(x => console.log(x));
  }
  

  isChecked: any;
  getSecurity(){
    interface ApiResponse {
      response: string;
    }
    this.userService.getClientSec(this.Role, this.ClientId).subscribe((x: ApiResponse) => {
      if (x.response == "ON") {
         this.isChecked = true;
      } 
      else if(x.response == "OFF"){
        this.isChecked = false;
      }
    });
  }

  onCheckboxChange(checked: boolean) {
    interface ApiResponse {
      response: string;
    }
    const data = new FormData();
    data.append("Role", this.Role);
    data.append("Id", this.ClientId);
    if (checked) 
    {
      alert('Enable 2FA');
      this.userService.change2FA(data).subscribe((x: ApiResponse)=> {
        if(x.response == "OFF"){
          this.isChecked = false;
        }
        else{
          this.isChecked = true;
        }
      })
    } 
    else 
    {
      alert('Disable 2FA');
      this.userService.change2FA(data).subscribe((x: ApiResponse)=> {
        if(x.response == "ON"){
          this.isChecked = true;
        }
        else{
          this.isChecked = false;
        }
      })
    }
  }


}
