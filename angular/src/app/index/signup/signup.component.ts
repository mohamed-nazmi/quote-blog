import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent {
    signupForm = new FormGroup({
        firstname: new FormControl(),
        lastname: new FormControl(),
        username: new FormControl(),
        email: new FormControl(),
        password: new FormControl(),
        confirmPassword: new FormControl()
    });
}
