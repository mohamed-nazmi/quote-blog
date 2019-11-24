import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { QuotesService } from '../quotes/quotes.service';
import { AuthService } from '../../index/auth.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
    viewQuotes: boolean;
    isUserAuth = false;
    private isAuthSub: Subscription;

    constructor(private quotesService: QuotesService, private authService: AuthService) { }

    newQuoteForm = new FormGroup({
        newQuote: new FormControl('', Validators.required)
    });

    ngOnInit() {
        this.viewQuotes = true;
        this.isUserAuth = this.authService.getIsAuth();
        this.isAuthSub = this.authService.getIsAuthListener()
            .subscribe(isAuth => {
                this.isUserAuth = isAuth;
            });
    }

    ngOnDestroy() {
        this.isAuthSub.unsubscribe();
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
