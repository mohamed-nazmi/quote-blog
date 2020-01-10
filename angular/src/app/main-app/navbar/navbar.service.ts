import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { AuthService } from 'src/app/index/auth.service';
import { ProfileInfo } from '../profile/profile.model';
import { Friend } from '../friends/friends.model';

import { environment } from '../../../environments/environment';

const BACKEND_URL = environment.apiUrl;

@Injectable({
    providedIn: 'root'
})
export class NavbarService {
    private searchedUsers: ProfileInfo[] = [];
    private searchUpdated = new Subject<ProfileInfo[]>();

    private receivedRequests: Friend[] = [];
    private receivedRequestsUpdated = new Subject<Friend[]>();

    private sentRequests: Friend[] = [];
    private sentRequestsUpdated = new Subject<Friend[]>();

    constructor(private http: HttpClient, private authService: AuthService) { }

    getSearchUpdateListener() {
        return this.searchUpdated.asObservable();
    }

    getReceivedRequestsUpdated() {
        return this.receivedRequestsUpdated.asObservable();
    }

    getSentRequestsUpdated() {
        return this.sentRequestsUpdated.asObservable();
    }

    searchUsers(user: string) {
        this.http.get<{ users: ProfileInfo[] }>(BACKEND_URL + '/search-user/' + user)
            .subscribe(result => {
                const username = this.authService.getUsername();
                const index = result.users.findIndex(searchedUser => searchedUser.username === username);
                if (index > 0) {
                    this.startWithCurrentUser(result.users, index);
                }
                this.searchedUsers = result.users;
                this.searchUpdated.next(this.searchedUsers);
            });
    }

    private startWithCurrentUser(users: ProfileInfo[], index: number) {
        const temp = users[0];
        users[0] = users[index];
        users[index] = temp;
    }

    displayReceivedRequests() {
        this.http.get<{ receivedRequests: Friend[] }>(BACKEND_URL + '/received-requests')
            .subscribe(result => {
                this.receivedRequests = result.receivedRequests;
                this.receivedRequestsUpdated.next(this.receivedRequests);
            });
    }

    displaySentRequests() {
        this.http.get<{ sentRequests: Friend[] }>(BACKEND_URL + '/sent-requests')
            .subscribe(result => {
                this.sentRequests = result.sentRequests;
                this.sentRequestsUpdated.next(this.sentRequests);
            });
    }
}
