import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
    private loginBackendError: string = null;
    private authStatusSub: Subscription;

    private loginForm = new FormGroup({
        loginInfo: new FormControl('', [ Validators.required ]),
        password: new FormControl('', [ Validators.required ])
    });

    constructor(private authService: AuthService) { }

    ngOnInit() {
        this.authStatusSub = this.authService.getAuthStatusListener()
            .subscribe(errorMsg => {
                this.loginBackendError = errorMsg;
            });
    }

    ngOnDestroy() {
        this.authStatusSub.unsubscribe();
    }

    get loginInfo() {
        return this.loginForm.get('loginInfo');
    }

    get password() {
        return this.loginForm.get('password');
    }

    specifyError(): string | null {
        // Email or username
        if (this.loginInfo.touched && this.loginInfo.invalid) {
            return 'Email (or username) is required.';
        }
        // Password
        if (this.password.touched && this.password.invalid) {
            return 'Password is required.';
        }
        // DB Errors
        if (this.loginBackendError) {
            return this.loginBackendError;
        }
        return null;
    }

    onLogin() {
        const user = {
            loginInfo: this.loginInfo.value,
            password: this.password.value
        };
        this.authService.login(user);
    }
}
