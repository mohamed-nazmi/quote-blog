import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../../index/auth.service';
import { NavbarService } from './navbar.service';
import { ProfileInfo } from '../profile/profile.model';
import { Friend } from '../friends/friends.model';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
    username: string;
    searchedUsers: ProfileInfo[];
    private searchSub: Subscription;

    receivedRequests: Friend[] = [];
    private receivedRequestsSub: Subscription;

    sentRequests: Friend[] = [];
    private sentRequestsSub: Subscription;

    private receivedOrSent = false;
    private requests;

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

        this.navbarService.displayReceivedRequests();
        this.receivedRequestsSub = this.navbarService.getReceivedRequestsUpdated()
            .subscribe(receivedRequests => {
                this.receivedRequests = receivedRequests;
                if (!this.receivedOrSent) {
                    this.requests = this.receivedRequests;
                }
            });

        this.navbarService.displaySentRequests();
        this.sentRequestsSub = this.navbarService.getSentRequestsUpdated()
            .subscribe(sentRequests => {
                this.sentRequests = sentRequests;
                if (this.receivedOrSent) {
                    this.requests = this.sentRequests;
                }
            });
    }

    ngOnDestroy() {
        this.searchSub.unsubscribe();
        this.receivedRequestsSub.unsubscribe();
        this.sentRequestsSub.unsubscribe();
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

    viewSentRequests($event: Event) {
        $event.stopPropagation();
        this.receivedOrSent = true;
        this.requests = this.sentRequests;
    }

    viewReceivedRequests($event: Event) {
        $event.stopPropagation();
        this.receivedOrSent = false;
        this.requests = this.receivedRequests;
    }
}
