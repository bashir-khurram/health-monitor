import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { User } from '../interfaces/user';
import { LocalStorageUtils } from '../utils/local-storage-utils';

export const loadDataForAuthService = (service: AuthService) => () =>  service.loadValidUsers();

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  static KEY_TOKEN = 'TOKEN';
  validUsers: User[] = [];

  constructor(private httpClient: HttpClient) { }

  login(user: User): boolean {
    let validUser = this.validUsers.find(u => u.email === user.email && u.password === user.password);
    if (validUser) {
      LocalStorageUtils.set(AuthService.KEY_TOKEN, validUser.token);
      return true;
    }
    return false;
  }

  logout(): void {
    LocalStorageUtils.remove(AuthService.KEY_TOKEN);
  }

  isLoggedIn(): boolean {
    let token = LocalStorageUtils.get(AuthService.KEY_TOKEN);
    if (this.validUsers.find(user => user.token === token)) {
      return true;
    }
    return false;
  }

  loadValidUsers(): Observable<any> {
    return this.httpClient.get('assets/dummy-data/login.json').pipe(tap(
      data => this.validUsers = data as User[]
    ));
  }

}
