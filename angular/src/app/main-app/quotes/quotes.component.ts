import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { Quote } from './quotes.model';
import { Lover } from './lovers.model';
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

    lovers: Lover[] = [];
    currentQuoteId: string;
    iscurrentQuoteLovedByUser: boolean;
    private loversSub: Subscription;
    private isLovedByUserSub: Subscription;

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

        this.loversSub = this.quotesService.getLoverUpdateListener()
            .subscribe(lovers => {
                this.lovers = lovers;
            });

        this.isLovedByUserSub = this.quotesService.getIsLovedUpdateListener()
            .subscribe(isLoved => {
                this.iscurrentQuoteLovedByUser = isLoved;
            });
    }

    ngOnDestroy() {
        this.isAuthSub.unsubscribe();
        this.quotesSub.unsubscribe();
        this.loversSub.unsubscribe();
        this.isLovedByUserSub.unsubscribe();
    }

    deleteQuote(quoteId: string) {
        this.quotesService.deleteQuote(quoteId);
    }

    fetchLovers(quoteId: string) {
        this.lovers = [];
        this.iscurrentQuoteLovedByUser = false;
        this.currentQuoteId = quoteId;
        this.quotesService.getQuoteLovers(quoteId);
    }

    loveQuote(quoteId: string) {
        this.quotesService.loveQuote(quoteId);
    }

    unloveQuote(quoteId: string) {
        this.quotesService.unloveQuote(quoteId);
    }
}
