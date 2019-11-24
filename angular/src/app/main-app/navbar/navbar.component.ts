import { Component } from '@angular/core';
import { AuthService } from '../../index/auth.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
    constructor(private authService: AuthService) { }

    onLogout() {
        this.authService.logout();
    }
}
