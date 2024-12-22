import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ContactData, EndPoints } from "./contact.model";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
  })
  export class ContactService {
  
    constructor(private httpClient: HttpClient) { }
  
    public getContacts(): Observable<any>{
      return this.httpClient.get(environment.apiUrl+EndPoints.getUrl);
    }

    public postContacts(data: ContactData): Observable<any> {
        return this.httpClient.post(environment.apiUrl+EndPoints.postUrl, data);
    }
  
    public updateContacts(data: ContactData): Observable<any> {
        return this.httpClient.post(environment.apiUrl+EndPoints.updateUrl, data);
    }

    public deleteContacts(id: number): Observable<any> {
        return this.httpClient.delete(environment.apiUrl+EndPoints.deleteUrl+id);
    }

  }

