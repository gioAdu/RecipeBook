import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../auth/user.model';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private tokenExprirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  signUp(email: string, password: string): Observable<any> {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseApiKey}`,
        {
          email,
          password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((respData) => {
          this.handleAuth(respData);
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseApiKey}`,
        {
          email,
          password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((respData) => {
          this.handleAuth(respData);
        })
      );
  }

  autoLogin() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }
    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.user.next(null);
    localStorage.removeItem('userData');
    this.router.navigate(['/auth']);
    if (this.tokenExprirationTimer) {
      clearTimeout(this.tokenExprirationTimer);
    }
    this.tokenExprirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
      this.tokenExprirationTimer = setTimeout(() => {
        this.logout();
      }, expirationDuration);
  }

  private handleAuth(respData: any) {
    const expirationDate = new Date(
      new Date().getTime() + respData.expiresIn * 1000
    );
    const user = new User(
      respData.email,
      respData.localId,
      respData.idToken,
      expirationDate
    );
    this.user.next(user);
    this.autoLogout(+respData.expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorResp: HttpErrorResponse) {
    let errorMsg = 'An unknown error occured';
    if (!errorResp.error.error) {
      return throwError(() => new Error(errorMsg));
    }
    switch (errorResp.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMsg = 'This email  already exists.';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMsg = 'User with this email does not exist.';
        break;
      case 'INVALID_PASSWORD':
        errorMsg = 'The password is invalid.';
        break;
    }
    return throwError(() => new Error(errorMsg));
  }
}
