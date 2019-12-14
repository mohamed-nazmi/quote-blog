import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Quote } from './quotes.model';
import { QuoteLover } from './quote-lovers.model';
import { QuoteComment } from './quote-comments.model';
import { environment } from '../../../environments/environment';

const BACKEND_URL = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class QuotesService {
    private quotes: Quote[] = [];
    private quotesUpdated = new Subject<Quote[]>();

    lovers: QuoteLover[];
    private loversUpdated = new Subject<QuoteLover[]>();
    private isLovedByUserUpdated = new Subject<boolean>();

    comments: QuoteComment[];
    private commentsUpdated = new Subject<QuoteComment[]>();

    constructor(private http: HttpClient) { }

    getQuotes() {
        this.http.get<{ quotes: Quote[] }>(BACKEND_URL + '/quotes')
            .subscribe(result => {
                this.quotes = result.quotes.reverse();
                this.quotesUpdated.next([...this.quotes]);
            });
    }

    getQuotesByUsername(username: string) {
        this.http.get<{ quotes: Quote[] }>(BACKEND_URL + '/quotes/' + username)
            .subscribe(result => {
                this.quotes = result.quotes;
                this.quotesUpdated.next([...this.quotes]);
            });
    }

    getQuoteLovers(quoteId: string) {
        this.http.get<{ lovers: QuoteLover[], isLovedByUser: boolean }>(BACKEND_URL + '/quote/lovers/' + quoteId)
            .subscribe(result => {
                this.lovers = result.lovers;
                this.loversUpdated.next([...this.lovers]);
                this.isLovedByUserUpdated.next(result.isLovedByUser);
            });
    }

    getQuoteComments(quoteId: string) {
        this.http.get<{ comments: QuoteComment[] }>(BACKEND_URL + '/quote/comments/' + quoteId)
            .subscribe(result => {
                this.comments = result.comments;
                this.commentsUpdated.next([...this.comments]);
            });
    }

    getQuoteUpdateListener() {
        return this.quotesUpdated.asObservable();
    }

    getLoverUpdateListener() {
        return this.loversUpdated.asObservable();
    }

    getIsLovedUpdateListener() {
        return this.isLovedByUserUpdated.asObservable();
    }

    getCommentUpdateListener() {
        return this.commentsUpdated.asObservable();
    }

    addQuote(content: string) {
        this.http.post<{ quote: Quote }>(
            BACKEND_URL + '/quote',
            {
                content
            })
            .subscribe(result => {
                this.quotes.unshift(result.quote);
                this.quotesUpdated.next([...this.quotes]);
            });
    }

    loveQuote(quoteId: string) {
        this.http.post<{ lover: QuoteLover }>(BACKEND_URL + '/love-quote/' + quoteId, { })
            .subscribe(result => {
                this.lovers.unshift(result.lover);
                this.loversUpdated.next([...this.lovers]);
                this.isLovedByUserUpdated.next(true);
            });
    }

    unloveQuote(quoteId: string) {
        this.http.post<{ unlover: QuoteLover }>(BACKEND_URL + '/unlove-quote/' + quoteId, { })
            .subscribe(result => {
                this.lovers = this.lovers.filter(lover => lover.username !== result.unlover.username);
                this.loversUpdated.next([...this.lovers]);
                this.isLovedByUserUpdated.next(false);
            });
    }

    deleteQuote(quoteId: string) {
        this.http.delete(BACKEND_URL + '/quote/' + quoteId)
            .subscribe(() => {
                this.quotes = this.quotes.filter(quote => quote._id !== quoteId);
                this.quotesUpdated.next([...this.quotes]);
            });
    }
}
