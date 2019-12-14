import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Quote } from './quotes.model';
import { Lover } from './lovers.model';
import { environment } from '../../../environments/environment';

const BACKEND_URL = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class QuotesService {
    private quotes: Quote[] = [];
    private quotesUpdated = new Subject<Quote[]>();

    lovers: Lover[];
    private loversUpdated = new Subject<Lover[]>();
    private isLovedByUserUpdated = new Subject<boolean>();

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
        this.http.get<{ lovers: Lover[], isLovedByUser: boolean }>(BACKEND_URL + '/quote/lovers/' + quoteId)
            .subscribe(result => {
                this.lovers = result.lovers;
                this.loversUpdated.next([...this.lovers]);
                this.isLovedByUserUpdated.next(result.isLovedByUser);
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
        this.http.post<{ lover: Lover }>(BACKEND_URL + '/love-quote/' + quoteId, { })
            .subscribe(result => {
                this.lovers.unshift(result.lover);
                this.loversUpdated.next([...this.lovers]);
                this.isLovedByUserUpdated.next(true);
            });
    }

    unloveQuote(quoteId: string) {
        this.http.post<{ unlover: Lover }>(BACKEND_URL + '/unlove-quote/' + quoteId, { })
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
