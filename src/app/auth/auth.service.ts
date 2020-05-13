import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from '../module/auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private atuhStatusListener = new Subject<boolean>();
  private isAuthendicated = false;
  private tokenTimer: any;
  private userId: string;

  constructor(private httpClient: HttpClient, private router: Router) { }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthendicated;
  }
  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.atuhStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.httpClient.post('http://localhost:3000/api/user/signup', authData)
      .subscribe(responce => {
        console.log(responce);
      });
  }

  loginUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.httpClient.post<{ token: string, expiresIn: number, userId: string }>('http://localhost:3000/api/user/login', authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAtuhTimer(expiresInDuration);
          this.isAuthendicated = true;
          this.userId = response.userId;
          this.atuhStatusListener.next(true);
          const nowTime = new Date();
          const expirationDate = new Date(nowTime.getTime() + expiresInDuration * 1000);
          this.saveAuthData(token, expirationDate, this.userId);
          this.router.navigate(['/']);
        }
      });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthendicated = true;
      this.userId = authInformation.userId;
      this.setAtuhTimer(expiresIn / 1000);
      this.atuhStatusListener.next(true);
    }
  }


  logout() {
    this.token = null;
    this.isAuthendicated = false;
    this.atuhStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/login']);
  }

  private setAtuhTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }
  private saveAuthData(token: string, expirationDate: Date, userid: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userid);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');

  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    };
  }
}
