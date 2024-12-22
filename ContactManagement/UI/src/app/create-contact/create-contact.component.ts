import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactData,InputContactData } from '../contact.model';
import {FormsModule,ReactiveFormsModule, FormControl, Validators, FormGroup } from '@angular/forms';
import { ContactService } from '../contact.service';
import { Observable, Subscription } from 'rxjs';
import { Toast } from 'bootstrap';

@Component({
  selector: 'app-create-contact',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './create-contact.component.html',
  styleUrls: ['./create-contact.component.css']
})
export class CreateContactComponent implements OnInit, OnChanges {
 @Input({required: true})contactInput: InputContactData;
 @Output() closeContactForm: EventEmitter<boolean> = new EventEmitter<boolean>();
 @ViewChild('errToast',{static:true}) toastEl!: ElementRef<HTMLDivElement>;

 toast: Toast | null = null;
 contact: ContactData;
 errorMessage: string;
 isDataSumitted:boolean = false;
 subscription: Subscription;
 observable: Observable<any>;
 contactForm: FormGroup = new FormGroup(
  {
    email: new FormControl('',[Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    firstName: new FormControl('',[Validators.required, Validators.maxLength(15),Validators.minLength(3)]),
    lastName: new FormControl('',[Validators.required, Validators.maxLength(15),Validators.minLength(3)]),
  });

 constructor(private service: ContactService){}

 ngOnInit(): void {
  this.toast = new Toast(this.toastEl.nativeElement,{});
 }

 ngOnChanges(): void {
  console.log('ngOnChanges()');
  this.contact = this.contactInput as ContactData;
  if(this.contactInput.isUpdated){
     this.loadContorlsData();
  }
  else{
    this.contact= new ContactData();
    this.contactForm.reset();
  }
 }

show(){
  this.toast!.show();
}

 submitUserConactData(){
  if(!this.contactForm.valid){
    return;
  }
  let data = this.contactForm.value as ContactData;
   if(this.contactInput.isUpdated){
    data.id=this.contact.id;
     this.observable = this.service.updateContacts(data);
   }
   else{
    this.observable = this.service.postContacts(data);
   }

   this.subscription = this.observable.subscribe(data=>{
    if(data.status){
       this.contactForm.reset();
       this.isDataSumitted = true;
      // this.closeContactForm.emit(true);
       setTimeout(() => {
        this.closeContactForm.emit(true);
       }, 2000);
    }
    else{
       this.errorMessage = data.errors[0];
       this.isDataSumitted = false;
    }
    this.show();
   },
  err=>{
    if(err.error && err.error.message){
      this.errorMessage = err.error.message;
    }
    else{
      this.errorMessage = 'Could not upload contact data';
    }
    this.isDataSumitted = false;
    this.show();
  });
 }

closeForm(){
  console.log('close form works');
  this.closeContactForm.emit(false);
}


 loadContorlsData(){
  console.log('loadContorlsData');
  this.contactForm.setValue({
    firstName: this.contact.firstName,
    lastName: this.contact.lastName,
    email: this.contact.email
  });
 }
 
}
