import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { SignupValidators } from './signup.validators';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
    private signupBackendError: string = null;
    private authStatusSub: Subscription;

    private signupForm = new FormGroup({
        firstname: new FormControl('', [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(12),
            SignupValidators.mustStartWithLetter,
            SignupValidators.cannotContainSpace,
            Validators.pattern('^[a-zA-Z-]+$')
        ]),
        lastname: new FormControl('', [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(14),
            SignupValidators.mustStartWithLetter,
            SignupValidators.cannotContainSpace,
            Validators.pattern('^[a-zA-Z-]+$')
        ]),
        username: new FormControl('', [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(16),
            SignupValidators.mustStartWithLetter,
            SignupValidators.cannotContainSpace,
            Validators.pattern('^[a-zA-Z0-9-_]+$')
        ]),
        email: new FormControl('', [
            Validators.required,
            Validators.email
        ]),
        password: new FormControl('', [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(32)
        ]),
        confirmPassword: new FormControl('', [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(32)
        ])
    });

    constructor(private authService: AuthService) { }

    ngOnInit() {
        this.authStatusSub = this.authService.getAuthStatusListener()
            .subscribe(errorMsg => {
                this.signupBackendError = errorMsg;
            });
    }

    ngOnDestroy() {
        this.authStatusSub.unsubscribe();
    }

    get firstname() {
        return this.signupForm.get('firstname');
    }

    get lastname() {
        return this.signupForm.get('lastname');
    }

    get username() {
        return this.signupForm.get('username');
    }

    get email() {
        return this.signupForm.get('email');
    }

    get password() {
        return this.signupForm.get('password');
    }

    get confirmPassword() {
        return this.signupForm.get('confirmPassword');
    }

    specifyError(): string | null {
        // First Name
        if (this.firstname.touched && this.firstname.invalid) {
            if (this.firstname.errors.required) {
                return 'First name is required.';
            }
            if (this.firstname.errors.minlength || this.firstname.errors.maxlength) {
                return 'First name must range from 3-12 letters.';
            }
            if (this.firstname.errors.firstCharNotLetter) {
                return 'First name must start with a letter.';
            }
            if (this.firstname.errors.containsSpace) {
                return 'First name cannot contain spaces.';
            }
            if (this.firstname.errors.pattern) {
                return 'First name must contain only letters (and/or hyphens).';
            }
        }
        // Last Name
        if (this.lastname.touched && this.lastname.invalid) {
            if (this.lastname.errors.required) {
                return 'Last name is required.';
            }
            if (this.lastname.errors.minlength || this.lastname.errors.maxlength) {
                return 'Last name must range from 3-14 letters.';
            }
            if (this.lastname.errors.firstCharNotLetter) {
                return 'Last name must start with a letter.';
            }
            if (this.lastname.errors.containsSpace) {
                return 'Last name cannot contain spaces.';
            }
            if (this.lastname.errors.pattern) {
                return 'Last name must contain only letters (and/or hyphens).';
            }
        }
        // Username
        if (this.username.touched && this.username.invalid) {
            if (this.username.errors.required) {
                return 'Username is required.';
            }
            if (this.username.errors.minlength || this.username.errors.maxlength) {
                return 'Username must range from 6-16 characters.';
            }
            if (this.username.errors.firstCharNotLetter) {
                return 'Username must start with a letter.';
            }
            if (this.username.errors.containsSpace) {
                return 'Username cannot contain spaces.';
            }
            if (this.username.errors.pattern) {
                return 'Username must contain letters, numbers, hyphens, or underscores.';
            }
        }
        // Email
        if (this.email.touched && this.email.invalid) {
            if (this.email.errors.required) {
                return 'Email is required.';
            }
            return 'Email is invalid.';
        }
        // Password
        if (this.password.touched && this.password.invalid) {
            if (this.password.errors.required) {
                return 'Password is required.';
            }
            if (this.password.errors.minlength || this.password.errors.maxlength) {
                return 'Password must have 8-32 characters.';
            }
        }
        // Confirm Password
        if (this.confirmPassword.touched && this.confirmPassword.invalid) {
            if (this.confirmPassword.errors.required) {
                return 'Confirm Password is required.';
            }
        }
        if (this.password.touched &&
            this.confirmPassword.touched &&
            this.confirmPassword.value !== this.password.value) {
                return 'Passwords must match.';
        }
        // DB Errors
        if (this.signupBackendError) {
            return this.signupBackendError;
        }
        // Default
        return null;
    }

    onSignup() {
        const newUser = {
            firstname: this.firstname.value,
            lastname: this.lastname.value,
            username: this.username.value,
            email: this.email.value,
            password: this.password.value,
            confirmPassword: this.confirmPassword.value
        };
        this.authService.signup(newUser);
    }
}
