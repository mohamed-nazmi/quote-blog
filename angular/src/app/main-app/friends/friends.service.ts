import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Friend } from './friends.model';
import { environment } from '../../../environments/environment';

const BACKEND_URL = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class FriendsService {
    private friends: Friend[] = [];
    private friendsUpdated = new Subject<Friend[]>();

    constructor(private http: HttpClient) { }

    getFriendsByUsername(username: string) {
        this.http.get<{ friends: Friend[] }>(BACKEND_URL + '/friends/' + username)
            .subscribe(result => {
                this.friends = result.friends;
                this.friendsUpdated.next([...this.friends]);
            });
    }

    getFriendUpdateListener() {
        return this.friendsUpdated.asObservable();
    }

    sendFriendRequest(requestedFriendId: string) {
        return this.http.post(
            BACKEND_URL + '/user/add-friend',
            {
                requestedFriendId
            });
    }

    undoFriendRequest(requestedFriendId: string) {
        return this.http.post(
            BACKEND_URL + '/user/undo-request',
            {
                requestedFriendId
            });
    }

    handleReceivedFriendRequest(requestedFriendId: string, doAccept: boolean) {
        return this.http.post(
            BACKEND_URL + '/user/handle-received-request',
            {
                requestedFriendId,
                doAccept
            });
    }

    deleteFriend(friendId: string) {
        return this.http.delete(BACKEND_URL + '/user/delete-friend/' + friendId);
    }
}
