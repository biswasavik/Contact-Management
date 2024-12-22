import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ContactData, EndPoints } from "./contact.model";

@Injectable({
    providedIn: 'root'
  })
  export class ContactService {
  
    constructor(private httpClient: HttpClient) { }
  
    public getContacts(): Observable<any>{
      return this.httpClient.get(EndPoints.appUrl+EndPoints.getUrl);
    }

    public postContacts(data: ContactData): Observable<any> {
        return this.httpClient.post(EndPoints.appUrl+EndPoints.postUrl, data);
    }
  
    public updateContacts(data: ContactData): Observable<any> {
        return this.httpClient.post(EndPoints.appUrl+EndPoints.updateUrl, data);
    }

    public deleteContacts(id: number): Observable<any> {
        return this.httpClient.delete(EndPoints.appUrl+EndPoints.deleteUrl+id);
    }

  }

