import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { KEY_USER_TOKEN, User } from '../interfaces';
import { LocalStorageUtils } from '../utils/local-storage-utils';

export const loadDataForAuthService = (service: AuthService) => () =>  service.loadValidUsers();

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private validUsers: User[] = [];
  private currentUser: User | undefined;

  constructor(private httpClient: HttpClient) { }

  login(user: User): boolean {
    this.currentUser = this.validUsers.find(u => u.email === user.email && u.password === user.password);
    if (this.currentUser) {
      LocalStorageUtils.set(KEY_USER_TOKEN, this.currentUser.token);
      return true;
    }
    return false;
  }

  logout(): void {
    LocalStorageUtils.remove(KEY_USER_TOKEN);
  }

  isLoggedIn(): boolean {
    let token = LocalStorageUtils.get(KEY_USER_TOKEN);
    this.currentUser = this.validUsers.find(user => user.token === token);
    if (this.currentUser) {
      return true;
    }
    return false;
  }

  loadValidUsers(): Observable<any> {
    return this.httpClient.get('assets/dummy-data/login.json')   // can also use post against real service
    .pipe(tap(
      data => this.validUsers = data as User[]
    ));
  }

  getCurrentUser(): User | undefined {
    return this.currentUser;
  }

}
