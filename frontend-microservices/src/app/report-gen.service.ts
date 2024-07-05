import {inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReportGenService {

  constructor(private http: HttpClient) { }

  download(month: string) {
    return this.http.get("http://localhost:4000/create", {headers: {"month": month}, observe: "response", responseType: "blob"});
  }
}
