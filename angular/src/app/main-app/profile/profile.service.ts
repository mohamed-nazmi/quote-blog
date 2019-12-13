import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { ProfileInfo } from './profile.model';
import { FriendsService } from '../friends/friends.service';
import { environment } from '../../../environments/environment';

const BACKEND_URL = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class ProfileService {
    private profileInfo: ProfileInfo;
    private profileUpdated = new Subject<ProfileInfo>();

    constructor(private http: HttpClient, private friendsService: FriendsService) { }

    getProfileInfo(username: string) {
        this.http.get<{ profileInfo: ProfileInfo }>(BACKEND_URL + '/profile/' + username)
            .subscribe(result => {
                this.profileInfo = result.profileInfo;
                this.profileUpdated.next(this.profileInfo);
            });
    }

    getProfileUpdateListener() {
        return this.profileUpdated.asObservable();
    }

    sendFriendRequest(requestedFriendId: string) {
        this.friendsService.sendFriendRequest(requestedFriendId)
            .subscribe(() => {
                this.profileInfo.relationship = 'Sent';
                this.profileUpdated.next(this.profileInfo);
            });
    }

    undoFriendRequest(requestedFriendId: string) {
        this.friendsService.undoFriendRequest(requestedFriendId)
            .subscribe(() => {
                this.profileInfo.relationship = 'None';
                this.profileUpdated.next(this.profileInfo);
            });
    }

    handleReceivedFriendRequest(requestedFriendId: string, doAccept: boolean) {
        this.friendsService.handleReceivedFriendRequest(requestedFriendId, doAccept)
            .subscribe(() => {
                if (doAccept) {
                    this.profileInfo.relationship = 'Friend';
                    const username = this.profileInfo.username;
                    this.friendsService.getFriendsByUsername(username);
                } else {
                    this.profileInfo.relationship = 'None';
                }
                this.profileUpdated.next(this.profileInfo);
            });
    }

    deleteFriend(friendId: string) {
        this.friendsService.deleteFriend(friendId)
            .subscribe(() => {
                this.profileInfo.relationship = 'None';
                const username = this.profileInfo.username;
                this.friendsService.getFriendsByUsername(username);
                this.profileUpdated.next(this.profileInfo);
            });
    }
}
