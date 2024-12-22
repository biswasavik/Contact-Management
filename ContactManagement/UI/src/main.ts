import { bootstrapApplication, BrowserModule, } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { CommonModule } from '@angular/common';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ContactService } from './app/contact.service';


bootstrapApplication(AppComponent, {
  providers: [
      importProvidersFrom(BrowserModule, CommonModule,HttpClientModule),
      //ContactService
      
  ],
  
})
.catch(err => console.log(err));
