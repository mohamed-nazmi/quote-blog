import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { Quote } from './quotes.model';
import { QuotesService } from './quotes.service';
import { AuthService } from '../../index/auth.service';

@Component({
    selector: 'app-quotes',
    templateUrl: './quotes.component.html',
    styleUrls: ['./quotes.component.css']
})
export class QuotesComponent implements OnInit, OnDestroy {
    quotes: Quote[];
    private quotesSub: Subscription;

    isUserAuth = false;
    private isAuthSub: Subscription;
    private userId: string;

    constructor(
        private quotesService: QuotesService,
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute) { }

    ngOnInit() {
        this.userId = this.authService.getUserId();
        if (this.router.url === '/in') {
            this.quotesService.getQuotes();
            this.quotesSub = this.quotesService.getQuoteUpdateListener()
                .subscribe(quotes => {
                    this.quotes = quotes;
                });
        } else {
            this.route.paramMap.subscribe(params => {
                this.quotesService.getQuotesByUsername(params.get('username'));
                this.quotesSub = this.quotesService.getQuoteUpdateListener()
                .subscribe(quotes => {
                    this.quotes = quotes;
                });
            });
        }

        this.isUserAuth = this.authService.getIsAuth();
        this.isAuthSub = this.authService.getIsAuthListener()
            .subscribe(isAuth => {
                this.isUserAuth = isAuth;
                this.userId = this.authService.getUserId();
            });
    }

    ngOnDestroy() {
        this.quotesSub.unsubscribe();
        this.isAuthSub.unsubscribe();
    }

    deleteQuote(quoteId: string) {
        this.quotesService.deleteQuote(quoteId);
    }
}
