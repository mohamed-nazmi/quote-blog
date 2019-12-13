import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Friend } from './friends.model';
import { FriendsService } from './friends.service';

enum Display {
    Friends,
    SentFriendRequests,
    ReceivedFriendRequests
}

@Component({
    selector: 'app-friends',
    templateUrl: './friends.component.html',
    styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit, OnDestroy {
    display: Display;

    friends: Friend[];
    private friendsSub: Subscription;

    constructor(
        private friendsService: FriendsService,
        private router: Router,
        private route: ActivatedRoute) { }

    ngOnInit() {
        this.display = Display.Friends;
        this.route.paramMap.subscribe(params => {
            this.friendsService.getFriendsByUsername(params.get('username'));
            this.friendsSub = this.friendsService.getFriendUpdateListener()
                .subscribe(friends => {
                    this.friends = friends;
                });
        });
    }

    ngOnDestroy() {
        this.friendsSub.unsubscribe();
    }

    get displayEnum() {
        return Display;
    }

    viewFriends() {
        this.display = Display.Friends;
    }

    viewSentRequests() {
        this.display = Display.SentFriendRequests;
    }

    viewReceivedRequests() {
        this.display = Display.ReceivedFriendRequests;
    }

    navigateTo(username: string) {
        this.router.navigate(['/in', username]);
    }
}
