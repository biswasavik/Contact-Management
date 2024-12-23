import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { CreateContactComponent } from './create-contact/create-contact.component';
import { ContactData,InputContactData } from './contact.model';
import { ContactService } from './contact.service';
import { CommonModule } from '@angular/common';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports:[CreateContactComponent,CommonModule,MatDialogModule]
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'Contacts App';
  contacts: ContactData[] = [];
  contactInput: InputContactData;
  isDataExists: boolean;
  subscription: Subscription;
  constructor(private service: ContactService, private dialog: MatDialog){}

  ngOnInit() {
    this.loadContacts();
    this.subscription=this.service.dataSubmmited.subscribe(data =>{
       if(data){this.loadContacts();}
    });
  }

  loadContacts(){
    this.subscription=this.service.getContacts().subscribe(data =>{
      if(data.status){
        this.contacts = data.result as ContactData[];
        if(this.contacts.length == 0){
          this.isDataExists=false;
        }
        else{
          this.isDataExists=true;
        }
      }
    })
  }

  edit(data: any){
    this.openDialog({isUpdate:true, contact:data});
  }

  create(){
    console.log('calling create..');
    this.openDialog({isUpdate:false});
  }

  delete(id:number){
    this.subscription=this.service.deleteContacts(id).subscribe(data=>{
      if(data.status){
        this.loadContacts();
      }
    });
  }

  openDialog(data:{isUpdate:boolean, contact?: ContactData}){
    const  dialogRef = this.dialog.open(CreateContactComponent,{
      width: '410px',
      height: '420px',
      data: data
    });
    
   this.subscription=dialogRef.afterClosed().subscribe(response=>{
    });
     
  }

  ngOnDestroy(): void {
     this.subscription?.unsubscribe();
  }

}
