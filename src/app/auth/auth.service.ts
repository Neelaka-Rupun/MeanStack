import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from '../module/auth-data.model';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private atuhStatusListener = new Subject<boolean>();


  constructor(private httpClient: HttpClient) {  }

  getToken() {
    return this.token;
  }

  getAuthStatusListener() {
    return this.atuhStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {email: email, password: password};
    this.httpClient.post('http://localhost:3000/api/user/signup', authData)
    .subscribe(responce => {
      console.log(responce);
    });
  }

  loginUser( email: string, password: string) {
    const authData: AuthData = {email: email, password: password};
    this.httpClient.post<{token: string}>('http://localhost:3000/api/user/login', authData )
    .subscribe( response => {
      const token = response.token;
      this.token = token;
      this.atuhStatusListener.next(true);
    });
  }

}
