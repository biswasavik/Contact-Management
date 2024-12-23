import { Component, ElementRef, EventEmitter, Inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactData,InputContactData } from '../contact.model';
import {FormsModule,ReactiveFormsModule, FormControl, Validators, FormGroup } from '@angular/forms';
import { ContactService } from '../contact.service';
import { Observable, Subscription } from 'rxjs';
import { Toast } from 'bootstrap';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-contact',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './create-contact.component.html',
  styleUrls: ['./create-contact.component.css']
})
export class CreateContactComponent implements OnInit, OnDestroy {
//  @Input({required: true})contactInput: InputContactData;
//  @Output() closeContactForm: EventEmitter<boolean> = new EventEmitter<boolean>();
 @ViewChild('errToast',{static:true}) toastEl!: ElementRef<HTMLDivElement>;


 toast: Toast | null = null;
 errorMessage: string;
 isDataSumitted:boolean = false;
 isUpdate: boolean;
 subscription: Subscription;
 observable: Observable<any>;
 contactForm: FormGroup = new FormGroup(
  {
    email: new FormControl('',[Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    firstName: new FormControl('',[Validators.required, Validators.maxLength(15),Validators.minLength(3)]),
    lastName: new FormControl('',[Validators.required, Validators.maxLength(15),Validators.minLength(3)]),
  });

 constructor(private service: ContactService, 
  public dialogRef: MatDialogRef<any>,
  @Inject(MAT_DIALOG_DATA) public data: any
 ){}

 ngOnInit(): void {
  this.toast = new Toast(this.toastEl.nativeElement,{});
  this.loadFormData();
 }

 loadFormData(){
    if(this.data.isUpdate && this.data.contact != null){
      this.loadContorlsData(this.data.contact as ContactData);
    }
    else{
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
   if(this.data.isUpdate && this.data.contact != null){
     data.id=this.data.contact.id;
     this.observable = this.service.updateContacts(data);
   }
   else{
    this.observable = this.service.postContacts(data);
   }

   this.subscription = this.observable.subscribe(data=>{
    if(data.status){
       this.contactForm.reset();
       this.isDataSumitted = true;
      this.service.dataSubmmited.next(true);
      // this.closeContactForm.emit(true);
      //  setTimeout(() => {
      //   this.
      //  }, 2000);
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
  this.dialogRef.close();
}

 loadContorlsData(contact: ContactData){
  console.log('loadContorlsData',contact);
  this.contactForm.setValue({
    firstName: contact.firstName,
    lastName: contact.lastName,
    email: contact.email
  });
 }
 
 ngOnDestroy(): void {
   this.subscription?.unsubscribe();
 }
}
