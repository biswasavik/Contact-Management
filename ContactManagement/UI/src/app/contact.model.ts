import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

export class ContactData{
  public id: number;
  public firstName: string;
  public lastName: string;
  public email: string;
}

export class EndPoints{
    public static appUrl="https://localhost:44310/";
    public static getUrl="api/GetContacts";
    public static postUrl="api/CreateContact";
    public static updateUrl="api/UpdateContact";
    public static deleteUrl="api/DeleteContact/";
}

export class InputContactData extends ContactData{
  public isUpdated: boolean
}
