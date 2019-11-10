import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
    isSignup: boolean;

    ngOnInit() {
        this.isSignup = false;
    }

    flipSignup() {
        this.isSignup = !this.isSignup;
    }
}
