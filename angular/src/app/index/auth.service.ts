import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private authStatusListener = new Subject<string>();

    constructor(private http: HttpClient, private router: Router) { }

    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }

    signup(newUser) {
        this.http.post(
            'http://localhost:3000/signup',
            {
                firstname: newUser.firstname,
                lastname: newUser.lastname,
                username: newUser.username,
                email: newUser.email,
                password: newUser.password,
                confirmPassword: newUser.confirmPassword
            })
            .subscribe(() => {
                // handle auth stuff ...
                this.router.navigate(['/in']);
            }, (httpErrorRes: HttpErrorResponse) => {
                this.authStatusListener.next(httpErrorRes.error.data);
            });
    }

    login(user) {
        this.http.post(
            'http://localhost:3000/login',
            {
                loginInfo: user.loginInfo,
                password: user.password
            })
            .subscribe(() => {
                // handle auth stuff ..
                this.router.navigate(['/in']);
            }, (httpErrorRes: HttpErrorResponse) => {
                this.authStatusListener.next(httpErrorRes.error.data);
            });
    }
}
