import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private token: string;
    private isAuth = false;
    private authStatusListener = new Subject<string>();
    private isAuthListener = new Subject<boolean>();
    private tokenTimer;
    private userId: string;
    private username: string;

    constructor(private http: HttpClient, private router: Router) { }

    getToken() {
        return this.token;
    }

    getIsAuth() {
        return this.isAuth;
    }

    getUserId() {
        return this.userId;
    }

    getUsername() {
        return this.username;
    }

    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }

    getIsAuthListener() {
        return this.isAuthListener.asObservable();
    }

    signup(newUser) {
        this.http.post<{ token: string, expiresIn: number, userId: string, username: string }>(
            'http://localhost:3000/signup',
            {
                firstname: newUser.firstname,
                lastname: newUser.lastname,
                username: newUser.username,
                email: newUser.email,
                password: newUser.password,
                confirmPassword: newUser.confirmPassword
            })
            .subscribe(response => {
                this.token = response.token;
                if (this.token) {
                    this.userId = response.userId;
                    this.username = response.username;
                    const expiresInDuration = response.expiresIn;
                    this.setAuthTimer(expiresInDuration);
                    this.isAuth = true;
                    this.isAuthListener.next(true);
                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
                    this.saveAuthData(this.token, expirationDate, this.userId, this.username);
                    this.router.navigate(['/in']);
                }
            }, (httpErrorRes: HttpErrorResponse) => {
                this.authStatusListener.next(httpErrorRes.error.data);
            });
    }

    login(user) {
        this.http.post<{ token: string, expiresIn: number, userId: string, username: string }>(
            'http://localhost:3000/login',
            {
                loginInfo: user.loginInfo,
                password: user.password
            })
            .subscribe(response => {
                this.token = response.token;
                if (this.token) {
                    this.userId = response.userId;
                    this.username = response.username;
                    const expiresInDuration = response.expiresIn;
                    this.setAuthTimer(expiresInDuration);
                    this.isAuth = true;
                    this.isAuthListener.next(true);
                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
                    this.saveAuthData(this.token, expirationDate, this.userId, this.username);
                    this.router.navigate(['/in']);
                }
            }, (httpErrorRes: HttpErrorResponse) => {
                this.authStatusListener.next(httpErrorRes.error.data);
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
            this.userId = authInformation.userId;
            this.username = authInformation.username;
            this.token = authInformation.token;
            this.isAuth = true;
            this.setAuthTimer(expiresIn / 1000);
            this.isAuthListener.next(true);
        }
    }

    logout() {
        this.userId = null;
        this.username = null;
        this.token = null;
        this.isAuth = false;
        this.isAuthListener.next(false);
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.router.navigate(['/']);
    }

    private setAuthTimer(duration: number) {
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, duration * 1000);
    }

    private saveAuthData(token: string, expirationDate: Date, userId: string, username: string) {
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());
        localStorage.setItem('userId', userId);
        localStorage.setItem('username', username);
    }

    private clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
    }

    private getAuthData() {
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');
        const userId = localStorage.getItem('userId');
        const username = localStorage.getItem('username');
        if (!token || !expirationDate) {
            return;
        }
        return {
            token,
            expirationDate: new Date(expirationDate),
            userId,
            username
        };
    }
}
