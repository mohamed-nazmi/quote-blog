import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { ProfileInfo } from './profile.model';
import { QuotesService } from '../quotes/quotes.service';
import { AuthService } from '../../index/auth.service';
import { ProfileService } from './profile.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
    viewQuotes: boolean;
    isUserAuth = false;
    private isAuthSub: Subscription;
    username: string;

    profileInfo: ProfileInfo = null;
    private profileSub: Subscription;

    constructor(
        private profileService: ProfileService,
        private quotesService: QuotesService,
        private authService: AuthService,
        private route: ActivatedRoute) { }

    newQuoteForm = new FormGroup({
        newQuote: new FormControl('', Validators.required)
    });

    ngOnInit() {
        this.viewQuotes = true;
        this.username = this.authService.getUsername();

        this.isUserAuth = this.authService.getIsAuth();
        this.isAuthSub = this.authService.getIsAuthListener()
            .subscribe(isAuth => {
                this.isUserAuth = isAuth;
                this.username = this.authService.getUsername();
            });

        this.route.paramMap.subscribe(params => {
            this.profileService.getProfileInfo(params.get('username'));
            this.profileSub = this.profileService.getProfileUpdateListener()
                .subscribe(profileInfo => {
                    this.profileInfo = profileInfo;
                });
        });

        this.profileSub = this.profileService.getProfileUpdateListener()
            .subscribe(profileInfo => {
                this.profileInfo = profileInfo;
            });
    }

    ngOnDestroy() {
        this.isAuthSub.unsubscribe();
        this.profileSub.unsubscribe();
    }

    sendRequest(userId: string) {
        this.profileService.sendFriendRequest(userId);
    }

    undoRequest(userId: string) {
        this.profileService.undoFriendRequest(userId);
    }

    acceptRequest(userId: string) {
        this.profileService.handleReceivedFriendRequest(userId, true);
    }

    declineRequest(userId: string) {
        this.profileService.handleReceivedFriendRequest(userId, false);
    }

    removeFriend(userId: string) {
        this.profileService.deleteFriend(userId);
    }

    get newQuote() {
        return this.newQuoteForm.get('newQuote');
    }

    addQuote(newQuote: HTMLInputElement) {
        this.quotesService.addQuote(newQuote.value);
    }

    viewQuotesSection() {
        this.viewQuotes = true;
    }

    viewFriendsSection() {
        this.viewQuotes = false;
    }
}
