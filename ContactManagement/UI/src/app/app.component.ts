import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CreateContactComponent } from './create-contact/create-contact.component';
import { ContactData,InputContactData } from './contact.model';
import { ContactService } from './contact.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports:[CreateContactComponent,CommonModule]
})
export class AppComponent implements OnInit, OnChanges {
  title = 'Contacts App';
  contacts: ContactData[] = [];
  contactInput: InputContactData;
  isShowContactForm:boolean=false;
  isDataExists: boolean;
  constructor(private service: ContactService){}

  ngOnInit() {
    this.getContacts();
  }

  ngOnChanges(){
  
  }
  getContacts(){
    this.service.getContacts().subscribe(data =>{
      if(data.status){
        this.contacts = data.result as ContactData[];
        if(this.contacts.length == 0){
          this.isDataExists=false;
          this.isShowContactForm=false;
        }
        else{
          this.isDataExists=true;
        }
      }
    })
  }

  edit(data: any){
    this.contactInput = data as InputContactData;
    this.contactInput.isUpdated = true;
    console.log('data',data);
    this.isShowContactForm=true;
  }

  create(){
    this.contactInput= new InputContactData();
    this.contactInput.isUpdated = false;
    this.isShowContactForm=true;
  }

  delete(id:number){
    this.service.deleteContacts(id).subscribe(data=>{
      if(data.status){
        this.getContacts();
      }
    });
  }

  closeContactForm(data:any){
    console.log('calling app close',data);
    this.isShowContactForm = false;
    if(data){
    this.getContacts();
    }
  }

}
