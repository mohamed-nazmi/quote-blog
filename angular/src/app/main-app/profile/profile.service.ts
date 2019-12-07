import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { ProfileInfo } from './profile.model';
import { environment } from '../../../environments/environment';

const BACKEND_URL = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class ProfileService {
    private profileInfo: ProfileInfo;
    private profileUpdated = new Subject<ProfileInfo>();

    constructor(private http: HttpClient) { }

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
        this.http.post(
            BACKEND_URL + '/user/add-friend',
            {
                requestedFriendId
            })
            .subscribe(() => {
                this.profileInfo.relationship = 'Sent';
                this.profileUpdated.next(this.profileInfo);
            });
    }

    undoFriendRequest(requestedFriendId: string) {
        this.http.post(
            BACKEND_URL + '/user/undo-request',
            {
                requestedFriendId
            })
            .subscribe(result => {
                this.profileInfo.relationship = 'None';
                this.profileUpdated.next(this.profileInfo);
            });
    }

    handleReceivedFriendRequest(requestedFriendId: string, doAccept: boolean) {
        this.http.post(
            BACKEND_URL + '/user/handle-received-request',
            {
                requestedFriendId,
                doAccept
            })
            .subscribe(result => {
                if (doAccept) {
                    this.profileInfo.relationship = 'Friend';
                } else {
                    this.profileInfo.relationship = 'None';
                }
                this.profileUpdated.next(this.profileInfo);
            });
    }

    deleteFriend(friendId: string) {
        this.http.delete(BACKEND_URL + '/user/delete-friend/' + friendId)
            .subscribe(result => {
                this.profileInfo.relationship = 'None';
                this.profileUpdated.next(this.profileInfo);
            });
    }
}
