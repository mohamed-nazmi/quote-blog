import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../index/auth.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
    username: string;

    constructor(private authService: AuthService) { }

    ngOnInit() {
        this.username = this.authService.getUsername();
    }

    onLogout() {
        this.authService.logout();
    }
}
