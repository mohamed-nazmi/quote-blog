import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../../index/auth.service';
import { NavbarService } from './navbar.service';
import { ProfileInfo } from '../profile/profile.model';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
    username: string;
    searchedUsers: ProfileInfo[];
    private searchSub: Subscription;

    private searchForm = new FormGroup({
        searchInput: new FormControl()
    });

    constructor(private authService: AuthService, private navbarService: NavbarService) { }

    ngOnInit() {
        this.username = this.authService.getUsername();
        this.searchSub = this.navbarService.getSearchUpdateListener()
            .subscribe(searchedUsers => {
                this.searchedUsers = searchedUsers;
            });
    }

    ngOnDestroy() {
        this.searchSub.unsubscribe();
    }

    get searchInput() {
        return this.searchForm.get('searchInput');
    }

    onLogout() {
        this.authService.logout();
    }

    fetchUsers() {
        if (this.searchInput.value.length > 0) {
            this.navbarService.searchUsers(this.searchInput.value);
        } else {
            this.searchedUsers = [];
        }
    }
}
