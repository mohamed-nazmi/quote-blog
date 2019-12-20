import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { Quote } from './quotes.model';
import { QuoteLover } from './quote-lovers.model';
import { QuoteComment } from './quote-comments.model';
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

    currentQuoteId: string;

    lovers: QuoteLover[] = [];
    iscurrentQuoteLovedByUser: boolean;
    private loversSub: Subscription;
    private isLovedByUserSub: Subscription;

    comments: QuoteComment[] = [];
    private commentsSub: Subscription;

    isUserAuth = false;
    private isAuthSub: Subscription;
    private userId: string;

    newCommentForm = new FormGroup({
        newComment: new FormControl('', [
            Validators.required,
            Validators.maxLength(18)
        ])
    });

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

        this.commentsSub = this.quotesService.getCommentUpdateListener()
            .subscribe(comments => {
                this.comments = comments;
            });
    }

    ngOnDestroy() {
        this.isAuthSub.unsubscribe();
        this.quotesSub.unsubscribe();
        this.loversSub.unsubscribe();
        this.isLovedByUserSub.unsubscribe();
        this.commentsSub.unsubscribe();
    }

    get newComment() {
        return this.newCommentForm.get('newComment');
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

    loveQuote() {
        this.quotesService.loveQuote(this.currentQuoteId);
    }

    unloveQuote() {
        this.quotesService.unloveQuote(this.currentQuoteId);
    }

    fetchComments(quoteId: string) {
        this.comments = [];
        this.currentQuoteId = quoteId;
        this.quotesService.getQuoteComments(quoteId);
    }

    addComment(newComment: HTMLInputElement) {
        this.quotesService.commentOnQuote(this.currentQuoteId, newComment.value);
        this.newCommentForm.reset();
    }
}
